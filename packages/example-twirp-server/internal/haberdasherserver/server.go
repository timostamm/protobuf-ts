package haberdasherserver

import (
    "context"
    "math/rand"

    "github.com/twitchtv/twirp"
    pb "../../rpc/haberdasher"
)

// Server implements the Haberdasher service
type Server struct {}

func (s *Server) MakeHat(ctx context.Context, size *pb.Size) (hat *pb.Hat, err error) {
    if size.Inches <= 0 {
        return nil, twirp.InvalidArgumentError("inches", "I can't make a hat that small!")
    }
    return &pb.Hat{
        Size:  size.Inches,
        Color: []string{"white", "black", "brown", "red", "blue"}[rand.Intn(4)],
        Name:  []string{"bowler", "baseball cap", "top hat", "derby"}[rand.Intn(3)],
    }, nil
}
