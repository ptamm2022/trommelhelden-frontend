import { NextFunction, Request, Response } from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import { Runtype } from "runtypes";
import { send } from "process";

const prisma = new PrismaClient();

export class CustomersController {
  async get(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      console.log("req", req);
      const { id } = req.params;
      const { query } = req;

      console.log(query);

      if (id) {
        console.log("id");
        return res.json();
      }
    } catch (err) {
      await prisma.$disconnect()
      return next(err);
    }
  }
  async delete(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { id } = req.params;
      const customer = await prisma.kunde.delete({
        where: {

        },
      });

      return res.json(customer);
    } catch (err) {
      await prisma.$disconnect()
      return next(err);
    }
  }
  async update(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { id } = req.params;
      console.log(req.body);

      const { data }: { data: Prisma.KundeUpdateInput } = req.body;

      const customer = await prisma.kunde.updateMany({
        data,
        where: {
        },
      });

      return res.json(customer);
    } catch (err) {
      await prisma.$disconnect()
      return next(err);
    }
  }
}
