import { IFilter, ISort } from "@/types";
import axios, { AxiosInstance } from "axios";
import { timeOutErrorHandler } from "../errorHandler";

interface IWrite<T> {
  create(item: T): Promise<boolean>;
  update(id: string, item: T): Promise<boolean>;
  delete(id: string): Promise<boolean>;
}

interface IRead<T> {
  get(id: string): Promise<T>;
  list(
    sort: ISort | null,
    filter: IFilter | null,
    page: number,
    rows: number,
  ): Promise<T[]>;
}

export abstract class BaseService<T> implements IWrite<T>, IRead<T> {
  public readonly _axiosInstance: AxiosInstance;
  private _tableName: string;
  static port = 4000;
  static rows = 10;

  constructor(tableName: string) {
    this._tableName = tableName;
    this._axiosInstance = axios.create({
      baseURL: `http://localhost:${BaseService.port}`,
      timeout: 10000,
    });
    this._axiosInstance.interceptors.response.use(
      (response) => response,
      timeOutErrorHandler,
    );
  }

  async create(item: T): Promise<boolean> {
    return (await this._axiosInstance.put(`/${this._tableName}`, item)).data;
  }
  async update(id: string, item: T): Promise<boolean> {
    return (await this._axiosInstance.patch(`/${this._tableName}/${id}`, item))
      .data;
  }
  async delete(id: string): Promise<boolean> {
    return (await this._axiosInstance.delete(`/${this._tableName}/${id}`)).data;
  }
  async list(
    sort: ISort | null,
    filter: IFilter | null,
    page = 0,
    rows: number = BaseService.rows,
  ): Promise<T[]> {
    return (
      await this._axiosInstance.post(`/${this._tableName}`, {
        sort,
        filter,
        page,
        rows,
      })
    ).data;
  }
  async get(id: string): Promise<T> {
    return (await this._axiosInstance.get(`/${this._tableName}/${id}`)).data;
  }
}
