using System;
using System.Globalization;
using System.Text;
using System.Threading.Tasks;
using Google.Protobuf.Collections;
using Grpc.AspNetCore.Web;
using Grpc.Core;
using Spec;

namespace asp_net_core_server
{
    [EnableGrpcWeb]
    public class ExampleService : Spec.ExampleService.ExampleServiceBase
    {
        public override async Task<ExampleResponse> Unary(ExampleRequest request, ServerCallContext context)
        {
            
            // by default, the server always writes some custom response headers
            if (!request.DisableSendingExampleResponseHeaders)
            {
                await context.WriteResponseHeadersAsync(new Metadata
                {
                    {"server-header", "server header value"},
                    {"server-header", "server header value duplicate"},
                    {"server-header-bin", Encoding.UTF8.GetBytes("server header binary value")},
                });
            }
            
            // always add some response trailers
            context.ResponseTrailers.Add("server-trailer", "server trailer value");
            context.ResponseTrailers.Add("server-trailer", "server trailer value duplicate");
            context.ResponseTrailers.Add("server-trailer-bin", Encoding.UTF8.GetBytes("server trailer binary value"));

            // wait for the requested amount of milliseconds
            await Task.Delay(request.PleaseDelayResponseMs, context.CancellationToken);

            // are we requested to fail? set an error status or even throw
            switch (request.PleaseFail)
            {
                case FailRequest.MessageThenErrorStatus:
                    context.Status = new Status(StatusCode.ResourceExhausted, "you requested an error");
                    break;
                case FailRequest.ErrorStatusOnly:
                    throw new RpcException(
                        new Status(StatusCode.ResourceExhausted, "you requested an error, no message"),
                        new Metadata
                        {
                            {"server-trailer", "created by rpc exception on server"}
                        }
                    );
                case FailRequest.None:
                    context.Status = new Status(StatusCode.OK, "great!");
                    break;
            }

            return new ExampleResponse
            {
                Answer = $"You asked: {request.Question}",
                YourDeadline = context.Deadline.ToString(CultureInfo.InvariantCulture),
                YourRequestHeaders = {MetadataToMap(context.RequestHeaders)},
                YourFailRequest = request.PleaseFail,
            };
        }

        public override async Task ServerStream(ExampleRequest request,
            IServerStreamWriter<ExampleResponse> responseStream, ServerCallContext context)
        {

            // by default, the server always writes some custom response headers
            if (!request.DisableSendingExampleResponseHeaders)
            {
                await context.WriteResponseHeadersAsync(new Metadata
                {
                    {"server-header", "server header value"},
                    {"server-header", "server header value duplicate"},
                    {"server-header-bin", Encoding.UTF8.GetBytes("server header binary value")},
                });
            }

            // always add some response trailers
            context.ResponseTrailers.Add("server-trailer", "server trailer value");
            context.ResponseTrailers.Add("server-trailer", "server trailer value duplicate");
            context.ResponseTrailers.Add("server-trailer-bin", Encoding.UTF8.GetBytes("server trailer binary value"));

            // are we requested to fail? set an error status or even throw
            switch (request.PleaseFail)
            {
                case FailRequest.MessageThenErrorStatus:
                    context.Status = new Status(StatusCode.ResourceExhausted, "you requested an error");
                    break;
                case FailRequest.ErrorStatusOnly:
                    throw new RpcException(
                        new Status(StatusCode.ResourceExhausted, "you requested an error, no message"),
                        new Metadata
                        {
                            {"server-trailer", "created by rpc exception on server"}
                        }
                    );
                case FailRequest.None:
                    context.Status = new Status(StatusCode.OK, "great!");
                    break;
            }
            
            var counter = 0;
            while (counter < 5)
            {
                // wait for the requested amount of milliseconds
                await Task.Delay(request.PleaseDelayResponseMs, context.CancellationToken);

                await responseStream.WriteAsync(new ExampleResponse
                {
                    Answer = $"#{(++counter).ToString()}"
                });
            }

            await responseStream.WriteAsync(new ExampleResponse
            {
                Answer = $"You asked: {request.Question}. I sent {counter} messages.",
                YourDeadline = context.Deadline.ToString(CultureInfo.InvariantCulture),
                YourRequestHeaders = {MetadataToMap(context.RequestHeaders)},
                YourFailRequest = request.PleaseFail,
            });
        }

        public override async Task<ExampleResponse> ClientStream(IAsyncStreamReader<ExampleRequest> requestStream,
            ServerCallContext context)
        {
            // always write some response headers
            await context.WriteResponseHeadersAsync(new Metadata
            {
                {"server-header", "server header value"},
                {"server-header", "server header value duplicate"},
                {"server-header-bin", Encoding.UTF8.GetBytes("server header binary value")},
            });
            
            context.Status = new Status(StatusCode.OK, "my server status");
            context.ResponseTrailers.Add("server-trailer", "server trailer value");
            context.ResponseTrailers.Add("server-trailer", "server trailer value duplicate");
            context.ResponseTrailers.Add("server-trailer-bin", Encoding.UTF8.GetBytes("server trailer binary value"));

            var questionCount = 0;
            while (await requestStream.MoveNext())
            {
                questionCount++;
            }

            return new ExampleResponse
            {
                Answer = $"You asked ${questionCount} questions.",
                YourDeadline = context.Deadline.ToString(CultureInfo.InvariantCulture),
                YourRequestHeaders = {MetadataToMap(context.RequestHeaders)},
            };
        }

        public override async Task Bidi(IAsyncStreamReader<ExampleRequest> requestStream,
            IServerStreamWriter<ExampleResponse> responseStream, ServerCallContext context)
        {

            // by default, the server always writes some custom response headers
            await context.WriteResponseHeadersAsync(new Metadata
            {
                {"server-header", "server header value"},
                {"server-header", "server header value duplicate"},
                {"server-header-bin", Encoding.UTF8.GetBytes("server header binary value")},
            });

            await responseStream.WriteAsync(new ExampleResponse
            {
                Answer = "Ask me anything"
            });

            var questionCount = 0;

            await foreach (var x in requestStream.ReadAllAsync())
            {
                questionCount++;
                switch (x.PleaseFail)
                {
                    case FailRequest.MessageThenErrorStatus:
                        context.Status = new Status(StatusCode.ResourceExhausted, "you requested an error");
                        await responseStream.WriteAsync(new ExampleResponse
                        {
                            Answer = $"You asked {questionCount} questions and requested an error"
                        });
                        break;
                    case FailRequest.ErrorStatusOnly:
                        throw new RpcException(
                            new Status(StatusCode.ResourceExhausted, "you requested an error, no message"),
                            new Metadata
                            {
                                {"server-trailer", "created by rpc exception on server"}
                            }
                        );
                    case FailRequest.None:
                        await responseStream.WriteAsync(new ExampleResponse
                        {
                            Answer = $"You asked: {x.Question}"
                        });
                        break;
                    default:
                        throw new ArgumentOutOfRangeException();
                }

            }
        }

        private static MapField<string, string> MetadataToMap(Metadata metadata)
        {
            var dict = new MapField<string, string>();
            if (metadata == null)
            {
                return dict;
            }

            foreach (var e in metadata)
            {
                if (e.IsBinary)
                {
                    dict.Add(e.Key + " (binary)", Convert.ToBase64String(e.ValueBytes));
                }
                else
                {
                    dict.Add(e.Key, e.Value);
                }
            }

            return dict;
        }
    }
}
