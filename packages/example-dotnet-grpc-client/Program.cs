using System;
using System.Threading;
using System.Threading.Tasks;
using Grpc.Core;
using Grpc.Net.Client;
using Spec;

namespace example_dotnet_grpc_client
{
    class Program
    {
        static void Main(string[] args)
        {
            AppContext.SetSwitch("System.Net.Http.SocketsHttpHandler.Http2UnencryptedSupport", true);
            var channel = GrpcChannel.ForAddress("http://localhost:5000", new GrpcChannelOptions());
            var client = new ExampleService.ExampleServiceClient(channel);
            try
            {
                var deadline = DateTime.UtcNow.Add(TimeSpan.FromMinutes(1));
                var request = new ExampleRequest
                {
                    PleaseFail = FailRequest.None
                };

                // MakeServerStreamingCall(client, deadline, request).GetAwaiter().GetResult();
                MakeUnaryCall(client, deadline, request).GetAwaiter().GetResult();
            }
            catch (Exception exception)
            {
                Console.WriteLine($"ERROR");
                Console.WriteLine($"{exception.Message}");
            }
        }


        private static async Task MakeServerStreamingCall(ExampleService.ExampleServiceClient client, DateTime deadline, ExampleRequest request)
        {

            Console.WriteLine("starting call...");
            var call = client.ServerStream(request, Metadata.Empty, deadline, CancellationToken.None);
            var headers = call.ResponseHeadersAsync;
            Console.WriteLine("got response headers: " + headers);

            Console.WriteLine("reading response stream...");
            await foreach (var m in call.ResponseStream.ReadAllAsync())
            {
                Console.WriteLine("read message: " + m);
            }
            Console.WriteLine("finished reading response stream.");

            var status = call.GetStatus();
            Console.WriteLine("read status: " + status);

            var trailers = call.GetTrailers();
            Console.WriteLine("read trailers: " + trailers);
        }



        private static async Task MakeUnaryCall(ExampleService.ExampleServiceClient client, DateTime deadline, ExampleRequest request)
        {
            Console.WriteLine("starting call...");
            var call = client.UnaryAsync(request, Metadata.Empty, deadline, CancellationToken.None);
            var headers = await call.ResponseHeadersAsync;
            Console.WriteLine("got response headers: " + headers);

            Console.WriteLine("reading response...");
            var msg = await call.ResponseAsync;
            Console.WriteLine("got response message: " + msg);

            var status = call.GetStatus();
            Console.WriteLine("read status: " + status);

            var trailers = call.GetTrailers();
            Console.WriteLine("read trailers: " + trailers);
        }



        private async void TestingTheCsharpClientApi()
        {
            var client = new ExampleService.ExampleServiceClient((ChannelBase) null);

            var deadline = DateTime.Now.Add(TimeSpan.FromMinutes(1));

            // new CallOptions()

            // unary

            var unaryCall =
                client.UnaryAsync(new ExampleRequest(), Metadata.Empty, deadline, CancellationToken.None);
            var unaryResponseHeaders = await unaryCall.ResponseHeadersAsync;
            var unaryResponse = await unaryCall.ResponseAsync;
            unaryCall.GetStatus();
            unaryCall.GetTrailers();


            // server streaming

            var serverStreamingCall =
                client.ServerStream(new ExampleRequest(), Metadata.Empty, deadline, CancellationToken.None);
            var serverStreamHeaders = serverStreamingCall.ResponseHeadersAsync;
            await foreach (var m in serverStreamingCall.ResponseStream.ReadAllAsync())
            {
            }

            serverStreamingCall.GetStatus();
            serverStreamingCall.GetTrailers();


            // client streaming

            var clientStreamingCall = client.ClientStream(Metadata.Empty, deadline, CancellationToken.None);
            await clientStreamingCall.RequestStream.WriteAsync(new ExampleRequest());
            await clientStreamingCall.RequestStream.CompleteAsync();
            var clientStreamResponseHeaders = await clientStreamingCall.ResponseHeadersAsync;
            var clientStreamResponse = await clientStreamingCall.ResponseAsync;
            clientStreamingCall.GetStatus();
            clientStreamingCall.GetTrailers();


            // duplex streaming

            var duplexCall = client.Bidi(Metadata.Empty, deadline, CancellationToken.None);
            var duplexResponseHeaders = await duplexCall.ResponseHeadersAsync;
            await duplexCall.RequestStream.WriteAsync(new ExampleRequest());
            await duplexCall.RequestStream.CompleteAsync();
            await foreach (var m in duplexCall.ResponseStream.ReadAllAsync())
            {
            }
            duplexCall.GetStatus();
            duplexCall.GetTrailers();

        }


    }
}
