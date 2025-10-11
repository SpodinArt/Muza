use actix_web::{web::{self}, HttpResponse};

use crate::routes::handlers;



pub fn config(config: &mut web::ServiceConfig){
    config
    .service(web::scope("")
    .service(handlers::home_handler::guest_root)
    .service(handlers::home_handler::guest_page)
    .service(handlers::home_handler::registration_page)
    .service(handlers::home_handler::create)
);
}