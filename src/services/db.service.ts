import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import { Code } from '../models/code.model';

// Definimos la interfaz completa de la base de datos
interface DatabaseService {
  init(): Promise<void>;
  getAllCodes(): Promise<Code[]>;
  getCodeById(id: string): Promise<Code | undefined>;
  createCode(data: string, type: string): Promise<Code>;
  deleteCode(id: string): Promise<boolean>;
  close(): Promise<void>;
}

// Implementación con clase para manejar el estado interno
class DatabaseServiceImpl implements DatabaseService {
  private db: Database<sqlite3.Database, sqlite3.Statement> | null = null;

  async init(): Promise<void> {
    this.db = await open({
      filename: './database.sqlite',
      driver: sqlite3.Database
    });

    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS codigos (
        id TEXT PRIMARY KEY NOT NULL DEFAULT (lower(hex(randomblob(16)))),
        data TEXT NOT NULL,
        type TEXT NOT NULL
      )
    `);
  }

  async getAllCodes(): Promise<Code[]> {
    if (!this.db) throw new Error('Database not initialized');
    return this.db.all('SELECT * FROM codigos');
  }

  async getCodeById(id: string): Promise<Code | undefined> {
    if (!this.db) throw new Error('Database not initialized');
    return this.db.get('SELECT * FROM codigos WHERE id = ?', id);
  }

  async createCode(data: string, type: string): Promise<Code> {
    if (!this.db) throw new Error('Database not initialized');
    const result = await this.db.run(
      'INSERT INTO codigos (data, type) VALUES (?, ?)',
      data, type
    );
    
    const newCode = await this.db.get<Code>(
      'SELECT * FROM codigos WHERE rowid = ?', 
      result.lastID
    );
    
    if (!newCode) throw new Error('Failed to retrieve created code');
    return newCode;
  }

  async deleteCode(id: string): Promise<boolean> {
    if (!this.db) throw new Error('Database not initialized');
    const result = await this.db.run(
      'DELETE FROM codigos WHERE id = ?',
      id
    );
    return (result.changes || 0) > 0;
  }

  async close(): Promise<void> {
    if (this.db) {
      await this.db.close();
      this.db = null;
    }
  }
}

// Exportamos una instancia única del servicio
export const db = new DatabaseServiceImpl();