import { NextFunction, Request, Response } from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import { Runtype } from "runtypes";
import { send } from "process";

const prisma = new PrismaClient();

export const getAssignments = async (req: Request, res: Response) => {
    try {
        console.log("Request received");
    
        const data = await prisma.auftrag.findMany();
        return res.send(JSON.stringify(data));
      } catch (e) {
        return res.status(400).send(e);
      }
      
}; 
export const updateAssignments = async (req: Request, res: Response) => {
    try {
        console.log("Request received");
    
        const data = await prisma.auftrag.findMany();
        return res.send(JSON.stringify(data));
      } catch (e) {
        return res.status(400).send(e);
      }
      
}; 
export const deleteAssignments = async (req: Request, res: Response) => {
    try {
        console.log("Request received");
    
        const data = await prisma.auftrag.findMany();
        return res.send(JSON.stringify(data));
      } catch (e) {
        return res.status(400).send(e);
      }
      
}; 
