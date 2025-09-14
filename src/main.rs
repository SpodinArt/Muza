use actix_web::{middleware::Logger, web, App, HttpResponse, HttpServer};
use sea_orm::{Database, DatabaseConnection};
use std::fmt;
use crate::utils::app_state::AppState;
use actix_files::Files;




mod utils;
mod routes;
mod repositories;

#[derive(Debug)]
struct MainError {
    message: String
}

impl fmt::Display for MainError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "Error: {}", self.message)
    }
}


impl std::error::Error for MainError {}

#[actix_web::main] // or #[tokio::main]
async fn main() -> Result<(), MainError> {

    if std::env::var_os("RUST_LOG").is_none() {
    std::env::set_var("RUST_LOG", "actix_web=info");
    }

    dotenv::dotenv().ok();
    env_logger::init();

    let port = (utils::constants::PORT).clone();
    let address = (utils::constants::ADDRESS).clone();
    let database_url = (utils::constants::DATABASE_URL).clone();

    let db: DatabaseConnection = Database::connect(database_url).await.map_err(|err| MainError {message: err.to_string()})?;

    HttpServer::new(move || {
        App::new()
                .service(Files::new("/css", "./static/css"))
        .service(Files::new("/images", "./static/images"))
        .service(Files::new("/scripts", "./static/scripts"))
        .service(Files::new("/media", "./static/media"))
        .service(Files::new("/fronts", "./static/fronts"))
 

        .app_data(web::Data::new(AppState{db:db.clone()}))
        .wrap(Logger::default())
        .configure(routes::home_routers::config)
        .configure(routes::auth_routes::config)
        .configure(routes::user_routes::config)


    })
    .bind((address, port))
    .map_err(|err| MainError {message: err.to_string()})?
    .run()
    .await
    .map_err(|err| MainError {message: err.to_string()})
}