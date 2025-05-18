from fastapi import FastAPI, UploadFile, File, Form, Depends, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Optional
import os
from sqlalchemy import create_engine, Column, Integer, String, Float, ForeignKey, DateTime, Text
from sqlalchemy.orm import sessionmaker, declarative_base, relationship, Session
from datetime import datetime
import shutil

app = FastAPI()

# Allow CORS for frontend dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATABASE_URL = "sqlite:///./quotes.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Models
class Part(Base):
    __tablename__ = "parts"
    id = Column(Integer, primary_key=True, index=True)
    part_number = Column(String, index=True)
    part_name = Column(String)
    quantity = Column(Integer)
    pdf_file = Column(String, nullable=True)
    step_file = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    material_cost = Column(Float, default=0.0)
    quote_id = Column(Integer, ForeignKey("quotes.id"))
    operations = relationship("Operation", back_populates="part")

class Operation(Base):
    __tablename__ = "operations"
    id = Column(Integer, primary_key=True, index=True)
    process = Column(String)
    setup_time = Column(Integer, default=0)  # minutes
    programming_time = Column(Integer, default=0)  # minutes
    first_part_time = Column(Integer, default=0)  # minutes
    part_time = Column(Integer, default=0)  # minutes
    external_days = Column(Integer, nullable=True)
    external_cost = Column(Float, nullable=True)
    part_id = Column(Integer, ForeignKey("parts.id"))
    part = relationship("Part", back_populates="operations")

class Quote(Base):
    __tablename__ = "quotes"
    id = Column(Integer, primary_key=True, index=True)
    quote_number = Column(String, unique=True, index=True)  # Added quote number
    client = Column(String)
    sender = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    parts = relationship("Part", backref="quote")

class Client(Base):
    __tablename__ = "clients"
    id = Column(Integer, primary_key=True, index=True)
    company_name = Column(String, unique=True, index=True)
    company_address = Column(String)
    company_email = Column(String)

class Sender(Base):
    __tablename__ = "senders"
    id = Column(Integer, primary_key=True, index=True)
    company_name = Column(String, unique=True, index=True)
    company_address = Column(String)
    company_email = Column(String)

Base.metadata.create_all(bind=engine)

# Add placeholder client and sender if not present
from sqlalchemy.exc import IntegrityError
with SessionLocal() as db:
    if not db.query(Client).first():
        try:
            db.add(Client(company_name="Placeholder Client", company_address="123 Client St", company_email="client@example.com"))
            db.commit()
        except IntegrityError:
            db.rollback()
    if not db.query(Sender).first():
        try:
            db.add(Sender(company_name="Placeholder Sender", company_address="456 Sender Ave", company_email="sender@example.com"))
            db.commit()
        except IntegrityError:
            db.rollback()

# Dependency

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# File upload endpoint
@app.post("/upload/")
def upload_files(
    pdf: UploadFile = File(...),
    step: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    upload_dir = "uploads"
    os.makedirs(upload_dir, exist_ok=True)
    pdf_path = os.path.join(upload_dir, pdf.filename)
    step_path = os.path.join(upload_dir, step.filename)
    with open(pdf_path, "wb") as f:
        shutil.copyfileobj(pdf.file, f)
    with open(step_path, "wb") as f:
        shutil.copyfileobj(step.file, f)
    return {"pdf": pdf_path, "step": step_path}

@app.get("/")
def read_root():
    return {"message": "EZ-RFQ FastAPI backend is running."}

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.get("/download/{filename}")
def download_file(filename: str):
    file_path = os.path.join("uploads", filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_path, filename=filename)

@app.get("/clients/")
def get_clients(db: Session = Depends(get_db)):
    clients = db.query(Client).all()
    return [
        {
            "id": c.id,
            "company_name": c.company_name,
            "company_address": c.company_address,
            "company_email": c.company_email,
        }
        for c in clients
    ]

@app.post("/clients/")
def add_client(client: dict = Body(...), db: Session = Depends(get_db)):
    c = Client(
        company_name=client.get('company_name'),
        company_address=client.get('company_address'),
        company_email=client.get('company_email')
    )
    db.add(c)
    db.commit()
    db.refresh(c)
    return {
        "id": c.id,
        "company_name": c.company_name,
        "company_address": c.company_address,
        "company_email": c.company_email,
    }

@app.get("/quotes/")
def list_quotes(db: Session = Depends(get_db)):
    quotes = db.query(Quote).all()
    return [
        {
            "id": q.id,
            "quote_number": q.quote_number,
            "client": q.client,
            "sender": q.sender,
            "created_at": q.created_at,
        }
        for q in quotes
    ]

@app.post("/quotes/next-number/")
def get_next_quote_number(db: Session = Depends(get_db)):
    last_quote = db.query(Quote).order_by(Quote.id.desc()).first()
    if last_quote and last_quote.quote_number.isdigit():
        next_number = str(int(last_quote.quote_number) + 1)
    else:
        next_number = "1"
    return {"next_quote_number": next_number}

@app.get("/senders/")
def get_senders(db: Session = Depends(get_db)):
    senders = db.query(Sender).all()
    return [
        {
            "id": s.id,
            "company_name": s.company_name,
            "company_address": s.company_address,
            "company_email": s.company_email,
        }
        for s in senders
    ]

@app.post("/senders/")
def add_sender(sender: dict = Body(...), db: Session = Depends(get_db)):
    s = Sender(
        company_name=sender.get('company_name'),
        company_address=sender.get('company_address'),
        company_email=sender.get('company_email')
    )
    db.add(s)
    db.commit()
    db.refresh(s)
    return {
        "id": s.id,
        "company_name": s.company_name,
        "company_address": s.company_address,
        "company_email": s.company_email,
    }

@app.post("/quotes/")
def create_quote(quote: dict = Body(...), db: Session = Depends(get_db)):
    try:
        quote_number = quote.get("quote_number")
        client = quote.get("client")
        sender = quote.get("sender")
        parts = quote.get("parts", [])
        if not quote_number or not client or not sender:
            raise HTTPException(status_code=400, detail="Missing required quote fields.")
        db_quote = Quote(quote_number=quote_number, client=client, sender=sender)
        db.add(db_quote)
        db.commit()
        db.refresh(db_quote)
        for part in parts:
            if not part.get("part_number") or not part.get("part_name"):
                raise HTTPException(status_code=400, detail="Each part must have part_number and part_name.")
            db_part = Part(
                part_number=part.get("part_number"),
                part_name=part.get("part_name"),
                quantity=part.get("quantity") or 1,
                description=part.get("description", ""),
                material_cost=part.get("material_cost") or 0,
                pdf_file=part.get("pdf_file"),
                step_file=part.get("step_file"),
                quote_id=db_quote.id
            )
            db.add(db_part)
            db.commit()
            db.refresh(db_part)
            for op in part.get("operations", []):
                # Skip empty/invalid operations
                if not op.get("process"):
                    continue
                db_op = Operation(
                    process=op.get("process"),
                    setup_time=op.get("setup_time") or 0,
                    programming_time=op.get("programming_time") or 0,
                    first_part_time=op.get("first_part_time") or 0,
                    part_time=op.get("part_time") or 0,
                    external_days=op.get("external_days"),
                    external_cost=op.get("external_cost"),
                    part_id=db_part.id
                )
                db.add(db_op)
        db.commit()
        return {"id": db_quote.id, "quote_number": db_quote.quote_number}
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error saving quote: {str(e)}")

@app.get("/quotes/{quote_id}")
def get_quote_detail(quote_id: int, db: Session = Depends(get_db)):
    q = db.query(Quote).filter(Quote.id == quote_id).first()
    if not q:
        raise HTTPException(status_code=404, detail="Quote not found")
    parts = db.query(Part).filter(Part.quote_id == q.id).all()
    part_list = []
    for p in parts:
        ops = db.query(Operation).filter(Operation.part_id == p.id).all()
        part_list.append({
            "part_number": p.part_number,
            "part_name": p.part_name,
            "quantity": p.quantity,
            "description": p.description,
            "material_cost": p.material_cost,
            "pdf_file": p.pdf_file,
            "step_file": p.step_file,
            "operations": [
                {
                    "process": o.process,
                    "setup_time": o.setup_time,
                    "programming_time": o.programming_time,
                    "first_part_time": o.first_part_time,
                    "part_time": o.part_time,
                    "external_days": o.external_days,
                    "external_cost": o.external_cost,
                } for o in ops
            ]
        })
    return {
        "id": q.id,
        "quote_number": q.quote_number,
        "client": q.client,
        "sender": q.sender,
        "created_at": q.created_at.isoformat() if q.created_at else None,
        "parts": part_list
    }

# Placeholder for more endpoints (file upload, quote management, etc.)
