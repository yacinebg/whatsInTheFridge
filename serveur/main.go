package main

import (
    "log"
    "net/http"
    "github.com/gorilla/mux"
    "serveur/handlers"
    "serveur/utils"
    "github.com/joho/godotenv"
    "go.mongodb.org/mongo-driver/mongo"
    "go.mongodb.org/mongo-driver/mongo/options"
    "context"
    "github.com/robfig/cron/v3"
)


var db *mongo.Database

func init() {
    err := godotenv.Load("keys.env")
    if err != nil {
        log.Fatalf("Erreur fichier .env")
    }
}

func initDB() {
    clientOptions := options.Client().ApplyURI("mongodb+srv://yacine:123789gg@cluster0.rpkn1w3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    client,_:= mongo.Connect(context.TODO(), clientOptions)
    db = client.Database("whatsInYourFridge")
    handlers.SetDatabase(db)
    utils.SetDatabase(db)
}

func main() {
    initDB()
    handlers.InitializeRecipes()

    c := cron.New()
    c.AddFunc("*/10 * * * *", handlers.FetchNewRecipes)
    c.Start()

    r := mux.NewRouter()
    r.HandleFunc("/", HomeHandler)
    r.HandleFunc("/api/login", handlers.Login).Methods("POST")
    r.HandleFunc("/api/signup", handlers.Signup).Methods("POST")
    r.HandleFunc("/api/protected", utils.ValidateTokenMiddleware(func(w http.ResponseWriter, r *http.Request) {
        w.Write([]byte("Access avec tokken"))
    })).Methods("GET")
    r.HandleFunc("/api/explore", utils.ValidateTokenMiddleware(handlers.GetRecipes)).Methods("GET")
    r.HandleFunc("/api/user/profile", utils.ValidateTokenMiddleware(handlers.GetUserProfile)).Methods("GET")
    r.HandleFunc("/api/user/upload-profile-pic", utils.ValidateTokenMiddleware(handlers.UploadProfileImage)).Methods("PUT")
    r.HandleFunc("/api/recipe/{id}", utils.ValidateTokenMiddleware(handlers.GetRecipeDetail)).Methods("GET")
    r.HandleFunc("/api/recipe/{id}/comments", handlers.GetCommentsHandler).Methods("GET")
    r.HandleFunc("/api/recipe/{id}/comment", utils.ValidateTokenMiddleware(handlers.AddCommentHandler)).Methods("POST")
    r.HandleFunc("/api/recipe/{id}/comment/{commentId}", utils.ValidateTokenMiddleware(handlers.DeleteCommentHandler)).Methods("DELETE")
    r.HandleFunc("/api/profile/comments", utils.ValidateTokenMiddleware(handlers.GetUserCommentsHandler)).Methods("GET")
    r.HandleFunc("/api/profile/comment/{commentId}", utils.ValidateTokenMiddleware(handlers.DeleteUserCommentHandler)).Methods("DELETE")
    r.HandleFunc("/api/profile/fridge-items", utils.ValidateTokenMiddleware(handlers.AddFridgeItemHandler)).Methods("POST")
    r.HandleFunc("/api/profile/fridge-items", utils.ValidateTokenMiddleware(handlers.GetFridgeItemsHandler)).Methods("GET")
    r.HandleFunc("/api/profile/fridge-items/{itemID}", utils.ValidateTokenMiddleware(handlers.DeleteFridgeItemHandler)).Methods("DELETE")
    r.HandleFunc("/api/profile/fridge-recipes", utils.ValidateTokenMiddleware(handlers.GetRecipesByFridgeItemsHandler)).Methods("GET")
    r.HandleFunc("/api/carousel-recipes", handlers.GetCarouselRecipes).Methods("GET")

    log.Fatal(http.ListenAndServe(":8080", r))
}

func HomeHandler(w http.ResponseWriter, r *http.Request) {
    w.Write([]byte("Accueil!"))
}
