use actix_web::{middleware::Logger, web, App, HttpServer};
use sea_orm::{Database, DatabaseConnection};

use crate::utils::app_state::AppState;

mod utils;
mod routes;

#[actix_web::main] // or #[tokio::main]
async fn main() -> std::io::Result<()> {

    if std::env::var_os("RUST_LOG").is_none() {
    std::env::set_var("RUST_LOG", "actix_web=info");
    }

    dotenv::dotenv().ok();
    env_logger::init();

    let port = (utils::constants::PORT).clone();
    let address = (utils::constants::ADDRESS).clone();
    let database_url = (utils::constants::DATABASE_URL).clone();

    let db: DatabaseConnection = Database::connect(database_url).await.unwrap();

    HttpServer::new(move || {
        App::new()
        .app_data(web::Data::new(AppState{db:db.clone()}))
        .wrap(Logger::default())
        .configure(routes::home_routers::config)
    })
    .bind((address, port))?
    .run()
    .await
}