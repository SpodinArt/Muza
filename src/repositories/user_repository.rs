use sea_orm::{DatabaseConnection, EntityTrait, ColumnTrait, QueryFilter};

pub struct UserRepository;

impl UserRepository {
    pub async fn user_exists_by_email(db: &DatabaseConnection, email: &str) -> Result<bool, sea_orm::DbErr> {
        let user = entity::logins::Entity::find()
            .filter(entity::logins::Column::Email.eq(email))
            .one(db)
            .await?;
            
        Ok(user.is_some())
    }
    
    pub async fn user_exists_by_login(db: &DatabaseConnection, login: &str) -> Result<bool, sea_orm::DbErr> {
        let user = entity::logins::Entity::find()
            .filter(entity::logins::Column::Login.eq(login))
            .one(db)
            .await?;
            
        Ok(user.is_some())
    }
}