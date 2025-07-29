#!/usr/bin/env python3
"""
管理员账号修改脚本
修改管理员用户名和密码为指定值
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from passlib.context import CryptContext
from models import Admin, Base

# 数据库配置
SQLITE_DATABASE_URL = "sqlite:///./database.db"
engine = create_engine(SQLITE_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 密码加密上下文
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def update_admin_credentials():
    """修改管理员账号和密码"""
    db = SessionLocal()
    try:
        # 查找现有管理员账号
        admin = db.query(Admin).first()
        
        if admin:
            # 更新现有管理员账号
            admin.username = "zkeq"
            admin.password_hash = pwd_context.hash("yu.z1756")
            db.commit()
            print(f"✅ 管理员账号已更新:")
            print(f"   用户名: {admin.username}")
            print(f"   密码: yu.z1756")
            print(f"   更新时间: {admin.created_at}")
        else:
            # 创建新的管理员账号
            new_admin = Admin(
                username="zkeq",
                password_hash=pwd_context.hash("yu.z1756")
            )
            db.add(new_admin)
            db.commit()
            print("✅ 新管理员账号已创建:")
            print(f"   用户名: {new_admin.username}")
            print(f"   密码: yu.z1756")
            
    except Exception as e:
        print(f"❌ 更新失败: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("🔧 开始更新管理员账号...")
    
    # 确保数据库表存在
    Base.metadata.create_all(bind=engine)
    
    # 执行账号更新
    update_admin_credentials()
    
    print("🎉 脚本执行完成!")