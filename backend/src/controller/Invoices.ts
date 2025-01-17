import { Prisma, PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

const prisma = new PrismaClient();

export class InvoicesController {
  async list(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const { sort, filter, page, rows } = req.body;
    const { getCount } = req.query;
    let count;

    if (getCount) {
      count = await prisma.rechnung.count({
        where: {
          ...filter,
        },
      });
    }

    const allInvoices = await prisma.rechnung.findMany({
      take: rows,
      skip: page,
      where: {
        ...filter,
      },
      include: {
        Auftrag: {
          include: {
            Rechnung: true,
            Mitarbeiter: true,
            Kunde: true,
            Montage: {
              include: {
                Ersatzteil: true,
              },
            },
          },
        },
      },
      orderBy: [...sort],
    });
    return res.status(200).json({ data: allInvoices, count });
  }

  async get(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const { KunNr, AufNr } = req.query;

    console.log(KunNr, AufNr);

    const invoice = await prisma.rechnung.findUnique({
      where: {
        KunNr_AufNr: {
          AufNr: Number(AufNr),
          KunNr: Number(KunNr),
        },
      },
      include: {
        Auftrag: {
          include: {
            Rechnung: true,
            Mitarbeiter: true,
            Kunde: true,
            Montage: true,
          },
        },
      },
    });

    return res.status(200).json(invoice);
  }

  async update(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const { KunNr, AufNr } = req.query;
    const { data }: { data: Prisma.RechnungUpdateInput } = req.body;

    await prisma.rechnung.update({
      data,
      where: {
        KunNr_AufNr: {
          AufNr: Number(AufNr),
          KunNr: Number(KunNr),
        },
      },
    });

    return res.sendStatus(200);
  }
  
  async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const { data } = req.body;
    if (!data) {
      return res.sendStatus(400);
    }
    console.log(data);

    const { AufNr, KunNr } = await prisma.rechnung.create({
      data: {
        RechBetrag:
          Number(data.Dauer) * Number(data["Mitarbeiter.MitStundensatz"]) 
          + 2.5 * Number(data.Anfahrt),
        AufNr: data.Aufnr,
        KunNr: Number(data.KunNr),
        RechDat: new Date(),
      },
    });

    return res.status(200).json({ AufNr, KunNr });
  }
}
