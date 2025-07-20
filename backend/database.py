from sqlalchemy import create_engine, MetaData
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from pathlib import Path

# 数据库文件路径
DATABASE_PATH = Path(__file__).parent / "app.db"
SQLALCHEMY_DATABASE_URL = f"sqlite:///{DATABASE_PATH}"

# 创建数据库引擎
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    connect_args={"check_same_thread": False},
    echo=False  # 设置为True可以看到SQL语句
)

# 创建会话工厂
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 创建基类
Base = declarative_base()

# 获取数据库会话的依赖函数
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 创建所有表
def create_tables():
    Base.metadata.create_all(bind=engine)

# 删除所有表（用于开发环境重置）
def drop_tables():
    Base.metadata.drop_all(bind=engine)