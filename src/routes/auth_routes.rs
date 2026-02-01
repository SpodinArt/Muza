use actix_web::web;

use crate::routes::handlers;

pub fn config(config: &mut web::ServiceConfig){
    config.service(
        web::scope("/auth")
            .service(handlers::auth_handlers::register)
            .service(handlers::auth_handlers::login)
            .service(handlers::password_reset::send_email_internal) // /password_reset_request
            .service(handlers::password_reset::pass_resset) // /pass_resset
    );
}