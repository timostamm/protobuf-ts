package main

import (
	"net/http"
	"github.com/rs/cors"
	"../../internal/haberdasherserver"
	"../../rpc/haberdasher"
)

func main() {
	server := &haberdasherserver.Server{} // implements Haberdasher interface
	twirpServer := haberdasher.NewHaberdasherServer(server, nil)

	// Make a CORS wrapper:
	corsWrapper := cors.New(cors.Options{
		AllowedOrigins: []string{"*"},
		AllowedMethods: []string{"POST"},
		AllowedHeaders: []string{"Content-Type", "Authorization"},
	})

	// Do the wrapping, and serve it:
	handler := corsWrapper.Handler(twirpServer)
	http.ListenAndServe(":8080", handler)
}

