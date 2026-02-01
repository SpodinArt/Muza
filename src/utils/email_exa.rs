use sea_orm::{DatabaseConnection, EntityTrait, ColumnTrait, QueryFilter};

pub struct UserRepository;
//Проверка существования email в логинах
impl UserRepository {
    pub async fn user_exists_by_email_in_logis(db: &DatabaseConnection, email: &str) -> Result<bool, sea_orm::DbErr> {
        let user = entity::logins::Entity::find()
            .filter(entity::logins::Column::Email.eq(email))
            .one(db)
            .await?;
            
        Ok(user.is_some())
    }
    //Проверка существования Email в таблице с кодами
    pub async fn _user_exists_by_email_in_code(db: &DatabaseConnection, email: &str) -> Result<bool, sea_orm::DbErr> {
        let user = entity::password_resets::Entity::find()
            .filter(entity::password_resets::Column::Email.eq(email))
            .one(db)
            .await?;
            
        Ok(user.is_some())
    }
    //Проверка существования логина
    pub async fn user_exists_by_login(db: &DatabaseConnection, login: &str) -> Result<bool, sea_orm::DbErr> {
        let user = entity::logins::Entity::find()
            .filter(entity::logins::Column::Login.eq(login))
            .one(db)
            .await?;
            
        Ok(user.is_some())
    }
}
//Проверка пустого поля email
pub fn null_email(email: &String) -> bool {
    let mut ret = true;
    if email.trim().is_empty() {
        ret = false;
    } ret
}