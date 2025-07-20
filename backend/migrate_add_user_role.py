#!/usr/bin/env python3
"""
数据库迁移脚本：添加用户角色字段
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import create_engine, text
from database import SQLALCHEMY_DATABASE_URL, get_db
from models import User, UserRole
from auth import get_password_hash

def migrate_add_role_column():
    """添加角色字段到现有用户表"""
    engine = create_engine(SQLALCHEMY_DATABASE_URL)
    
    try:
        with engine.connect() as connection:
            # 检查role字段是否已存在
            result = connection.execute(text("""
                SELECT COUNT(*) as count 
                FROM pragma_table_info('users') 
                WHERE name = 'role'
            """))
            
            count = result.fetchone()[0]
            
            if count == 0:
                print("添加role字段到users表...")
                # 添加role字段，默认值为'user'
                connection.execute(text("""
                    ALTER TABLE users 
                    ADD COLUMN role VARCHAR(20) DEFAULT 'user' NOT NULL
                """))
                connection.commit()
                print("✅ role字段添加成功")
            else:
                print("✅ role字段已存在，跳过迁移")
                
    except Exception as e:
        print(f"❌ 迁移失败: {e}")
        return False
    
    return True

def create_admin_user():
    """创建管理员用户"""
    from sqlalchemy.orm import sessionmaker
    
    engine = create_engine(SQLALCHEMY_DATABASE_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    
    try:
        # 检查是否已有管理员用户
        admin_user = db.query(User).filter(User.role == UserRole.ADMIN).first()
        
        if not admin_user:
            print("创建默认管理员用户...")
            admin_user = User(
                username="admin",
                email="admin@neuralchat.com",
                hashed_password=get_password_hash("admin123"),
                full_name="系统管理员",
                role=UserRole.ADMIN,
                is_active=True
            )
            
            db.add(admin_user)
            db.commit()
            db.refresh(admin_user)
            
            print("✅ 管理员用户创建成功")
            print("   用户名: admin")
            print("   密码: admin123")
            print("   请登录后立即修改密码！")
        else:
            print("✅ 管理员用户已存在")
            
    except Exception as e:
        print(f"❌ 创建管理员用户失败: {e}")
        db.rollback()
    finally:
        db.close()

def main():
    print("🚀 开始数据库迁移...")
    
    # 1. 添加role字段
    if migrate_add_role_column():
        print("✅ 数据库结构迁移完成")
    else:
        print("❌ 数据库结构迁移失败")
        return
    
    # 2. 创建管理员用户
    create_admin_user()
    
    print("🎉 迁移完成！")

if __name__ == "__main__":
    main()