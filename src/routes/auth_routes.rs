use actix_web::web;

use crate::routes::handlers;

pub fn config(config: &mut web::ServiceConfig){
    config.service(
        web::scope("/auth")
            .service(handlers::auth_handlers::register)
            .service(handlers::auth_handlers::login)
    );
}