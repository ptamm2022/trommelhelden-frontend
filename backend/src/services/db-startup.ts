import { faker } from "@faker-js/faker/locale/de";
import {
  Auftrag,
  Ersatzteil,
  Kunde,
  Mitarbeiter,
  Montage,
  Niederlassung,
  Prisma,
  PrismaClient,
  prisma,
} from "@prisma/client";

// =========== Ersatzteil ===========

function createRandomErsatzteil(): Prisma.ErsatzteilCreateManyInput {
    const EtID = faker.helpers.unique(faker.random.alphaNumeric, [
        5,
        {
          casing: "upper",
        },
    ]);

    const ersatzteilNamen = [
        "Anschlussschlauch",
        "Antriebsriemen",
        "Einsatz für Einspülschale",
        "Einspülschale",
        "Einspülschalenunterteil",
        "Federkolbendämpfer mit Befestigungssatz",
        "Flusensieb",
        "Flusensiebeinsatz",
        "Heizelement",
        "Kohlebürsten",
        "Kugellager",
        "Lagersatz",
        "Laugenpumpe",
        "Magnetventil",
        "Pumpensumpf Ablaufschlauch",
        "Saugschlauch",
        "Stoßdämpfer",
        "Temperaturfühler",
        "Türverriegelung elektrisch",
        "Verriegelungsrelais"
    ];

    const zufälligerIndexErsatzteil = Math.floor(Math.random() * ersatzteilNamen.length);
    const EtBezeichnung = ersatzteilNamen[zufälligerIndexErsatzteil];
    const EtPreis = faker.datatype.number({ min: 2, max: 70, precision: 0.01 });
    const EtAnzLager = faker.datatype.number({ min: 0, max: 400 });

    const herstellerNamen = [
        "Hauknecht",
        "Liemens",
        "Mosch",
        "Tiele"
    ];
    
    const zufälligerIndexHersteller = Math.floor(Math.random() * herstellerNamen.length);
    const EtHersteller = herstellerNamen[zufälligerIndexHersteller];

    return {
      EtID,
      EtBezeichnung,
      EtPreis,
      EtAnzLager,
      EtHersteller,
    };
}

// =========== Niederlassung ===========

function createRandomNiederlassung(i: number): Prisma.NiederlassungCreateManyInput {
  let Ort = faker.address.cityName();
  if (i==0) Ort = "Dresden"
  else if (i==1) Ort = "Chemnitz"
  else if (i==2) Ort = "Radebeul"

  return {
    Ort,
  };
}

// =========== Kunde ===========

function createRandomKunde(i: number): Prisma.KundeCreateManyInput {
  const KunNr = i;
  const KunName = faker.name.fullName().slice(0, 20);
  const KunOrt = faker.address.cityName().slice(0, 20);
  const KunPLZ = faker.address.zipCode();
  const KunStrasse = faker.address.streetAddress().slice(0, 20);

  return {
    KunName,
    KunOrt,
    KunPLZ,
    KunStrasse,
  };
}

// =========== Mitarbeiter ===========

function createRandomMitarbeiter(
  i: number,
  ret: Niederlassung[]
): Prisma.MitarbeiterCreateInput {
  const MitName = faker.name.lastName();
  const MitVorname = faker.name.firstName();
  const MitGebDat = faker.date.between("1950-01-01", "2000-12-31");

  const jobNamen = [
    "Auftragskoordinator",
    "Einkauf",
    "Lagermitarbeiter",
    "Meister",
    "Monteur",
    "Azubi"
  ];

  const zufälligerIndexJob = Math.floor(Math.random() * jobNamen.length);
  const MitJob = jobNamen[zufälligerIndexJob];
  const MitStundensatz = faker.datatype.number({ min: 75, max: 125 });
  const NLNr = faker.helpers.arrayElement(ret).NLNr;

  return {
    MitName,
    MitVorname,
    MitGebDat,
    MitJob,
    MitStundensatz,
    Niederlassung: {
      connect: {
        NLNr,
      },
    },
  };
}

// =========== Auftrag ===========

function createRandomAuftrag(
  mitarbeiter: Mitarbeiter[],
  kunden: Kunde[],
  Ersatzteil: Ersatzteil[]
): Prisma.AuftragCreateInput {

  // === 1. Auftrag erstellen ===
  // > Kunde
  const KunNr = faker.helpers.arrayElement(kunden).KunNr;
  
  // > Beschreibung
  const beschreibungAuftrag = [
    "Dichtung porös",
    "Feinjustierung Axialmotor",
    "häufige Überladung",
    "Hauptlager ausgeschlagen",
    "Heizstäbe verkalkt",
    "instabiler Aufstellort",
    "Kabelbruch",
    "Laugenpumpe leckt",
    "Leckage am Wasserkreislauf",
    "Reinigung Vorfilter",
    "Sondermodell",
    "Steckerleister korrodiert",
    "Trommel klappert",
    "Vollverkalkung",
    "Wackelkontakt Drehschalter",
    "Wackelkontakt Steckerleiste"
  ];

  var Beschreibung = "";

  if (Math.random() <= 0.03) {
    const zufälligerIndexBeschreibung = Math.floor(Math.random() * beschreibungAuftrag.length);
    Beschreibung = beschreibungAuftrag[zufälligerIndexBeschreibung];
  } 
  
  // > AufDat
  const AufDat = faker.date.between(
    new Date().setFullYear(2015),
    new Date().setFullYear(2023)
  );
  
  let MitID;
  let ErlDat;
  let Dauer;
  let Anfahrt;

  if (Math.random() >= 0.06) 
  {
    // === 2. Auftrag planen ===
    MitID = faker.helpers.arrayElement(mitarbeiter).MitID;

    const maxErlDat = new Date(AufDat.getTime() + 50 * 24 * 60 * 60 * 1000);  // 1 Tag in Millisekunden
    const minErlDat = new Date(AufDat.getTime() + 1 * 24 * 60 * 60 * 1000);   // 50 Tage in Millisekunden

    ErlDat = faker.date.between(
      minErlDat,
      maxErlDat
    );

    if (Math.random() >= 0.06) 
    {
      // === 3. Auftrag erledigen ===
      Dauer = new Prisma.Decimal(faker.datatype.number({ min: 1, max: 20 }));
      Anfahrt = faker.datatype.number({ min: 1, max: 100 });

      const anzahlErsatzteile = faker.datatype.number({ min: 1, max: 3 });

      let ersatzteileMontage = [];
      ersatzteileMontage[0] = faker.helpers.arrayElement(Ersatzteil).EtID; // erstes Ersatzteil wird festgelegt.

      if(anzahlErsatzteile>1) 
      {
        do 
        {
          ersatzteileMontage[1] = faker.helpers.arrayElement(Ersatzteil).EtID;
        } while(ersatzteileMontage[1]==ersatzteileMontage[0]) // zweites ET darf nicht dem ersten entsprechen
      }

      if(anzahlErsatzteile>2) 
      {
        do 
        {
          ersatzteileMontage[2] = faker.helpers.arrayElement(Ersatzteil).EtID;
        } while(ersatzteileMontage[2]==ersatzteileMontage[0]||ersatzteileMontage[2]==ersatzteileMontage[1]) // drittes ET darf weder dem ersten noch dem zweiten entsprechen
      }

      let montagen = [];
      
      for (let i = 0; i < anzahlErsatzteile; i++) 
      {
        montagen.push(
        {
          Anzahl: faker.datatype.number({ min: 1, max: 3 }),
          Ersatzteil: 
          {
            connect: 
            {
              EtID: ersatzteileMontage[i],
            },
          },
        }
        );
      }

      return {
        Beschreibung,
        ErlDat,
        AufDat,
        Dauer,
        Anfahrt,
        Kunde: {
          connect: {
            KunNr,
          },
        },
        Mitarbeiter: {
          connect: {
            MitID,
          },
        },
        Montage: {
          create: montagen,
        },
      };
    } else {
      return {
        Beschreibung,
        ErlDat,
        AufDat,
        Kunde: {
          connect: {
            KunNr,
          },
        },
        Mitarbeiter: {
          connect: {
            MitID,
          },
        },
      };
    }
  } else {
    return {
      Beschreibung,
      AufDat,
      Kunde: {
        connect: {
          KunNr,
        },
      },
    };

  }

}

// ======================

export const createData = async (
  customers: number,
  employees: number,
  orders: number,
  branches: number,
  spareparts: number
) => {
  const prisma = new PrismaClient();

  // =========== Niederlassungen ===========

  const niederlassungen: Prisma.NiederlassungCreateManyInput[] = [];
  
  for (let i = 0; i < branches; i++) {
    niederlassungen.push(createRandomNiederlassung(i));
  }
  
  await prisma.niederlassung.createMany({
    data: niederlassungen as Prisma.NiederlassungCreateManyInput[],
  });

  let baa = await prisma.niederlassung.findMany();

  // =========== Mitarbeiter ===========

  for (let i = 100; i < employees + 100; i++) {
    let o = createRandomMitarbeiter(i, baa);

    await prisma.mitarbeiter.create({ data: o });
  }

  // =========== Ersatzteile ===========

  const ersatzteile: Prisma.ErsatzteilCreateManyInput[] = [];
  
  for (let i = 0; i < spareparts; i++) {
    ersatzteile.push(createRandomErsatzteil());
  }

  await prisma.ersatzteil.createMany({ data: ersatzteile });

  // =========== Kunde ===========

  const kunden: Prisma.KundeCreateInput[] = [];

  for (let i = 0; i < customers; i++) {
    kunden.push(createRandomKunde(i));
  }

  await prisma.kunde.createMany({ data: kunden });

  // =========== Auftrag ===========
  
  const mitar = await prisma.mitarbeiter.findMany({
    where: {
      MitJob: {
        in: ["Azubi", "Monteur", "Meister"]
      }
    }
  });
  const kund = await prisma.kunde.findMany();
  const ersa = await prisma.ersatzteil.findMany();
  console.log(createRandomAuftrag(mitar, kund, ersa));
  
  for (let i = 0; i < orders; i++) {
    await prisma.auftrag.create({ data: createRandomAuftrag(mitar, kund, ersa) });
  }

  // ======================

  await prisma.$disconnect();
};
