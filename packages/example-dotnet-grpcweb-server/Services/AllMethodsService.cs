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
    public class AllMethodsService : Spec.AllMethodsService.AllMethodsServiceBase
    {
        public override async Task<AllMethodsResponse> Unary(AllMethodsRequest request, ServerCallContext context)
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
            await Task.Delay(request.PleaseDelayResponseMs);

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

            return new AllMethodsResponse
            {
                Answer = $"You asked: {request.Question}",
                YourDeadline = context.Deadline.ToString(CultureInfo.InvariantCulture),
                YourRequestHeaders = {MetadataToMap(context.RequestHeaders)},
                YourFailRequest = request.PleaseFail,
            };
        }

        public override async Task ServerStream(AllMethodsRequest request,
            IServerStreamWriter<AllMethodsResponse> responseStream, ServerCallContext context)
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
                await Task.Delay(request.PleaseDelayResponseMs);

                await responseStream.WriteAsync(new AllMethodsResponse
                {
                    Answer = $"#{(++counter).ToString()}"
                });
            }

            await responseStream.WriteAsync(new AllMethodsResponse
            {
                Answer = $"You asked: {request.Question}. I sent {counter} messages.",
                YourDeadline = context.Deadline.ToString(CultureInfo.InvariantCulture),
                YourRequestHeaders = {MetadataToMap(context.RequestHeaders)},
                YourFailRequest = request.PleaseFail,
            });
        }

        public override async Task<AllMethodsResponse> ClientStream(IAsyncStreamReader<AllMethodsRequest> requestStream,
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

            return new AllMethodsResponse
            {
                Answer = $"You asked ${questionCount} questions.",
                YourDeadline = context.Deadline.ToString(CultureInfo.InvariantCulture),
                YourRequestHeaders = {MetadataToMap(context.RequestHeaders)},
            };
        }

        public override Task Bidi(IAsyncStreamReader<AllMethodsRequest> requestStream,
            IServerStreamWriter<AllMethodsResponse> responseStream, ServerCallContext context)
        {
            // context.


            return base.Bidi(requestStream, responseStream, context);
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
