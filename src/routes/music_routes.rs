use actix_web::web;
use crate::routes::handlers::{self};

pub fn config(config: &mut web::ServiceConfig) {
    config.service(
        web::scope("/api")  // Добавляем префикс /api
            .service(handlers::music_handler::get_filters)
            .service(handlers::music_handler::find_pieces)
        );
}