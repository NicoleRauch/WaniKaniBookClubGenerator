import * as R from "ramda";

const bewertung =
    {
        1: 9.5,
        2: 9.5,
        3: 9.5,
        4: 11,
        5: 9.5,
        6: 10,
        7: 14.5,
        8: 11,
        9: 12,
        10: 11.5,
        11: 12,
        12: 13.5,
        13: 12.5,
        14: 9.5,
        15: 9,
        16: 9.5,
        17: 14.5,
        18: 8,
    }

const summiereListe = (list: number[]): number =>
    R.sum(list.map(e => bewertung[e]));

const bewerteFitness = (list: number[][]): number =>
    R.reduce(
        (acc: number, elem: number[]) => R.max(summiereListe(elem), acc),
        0,
        list);

const fitnessListe = (list: number[][][]): number[] =>
    list.map(bewerteFitness);

type Fitness = {fitness: number, list: number[][]};

const findeBesteFitness = (gesamtliste: number[][][]): Fitness =>
    R.reduce(
        (acc: Fitness, list: number[][]) => {
            const fitness = bewerteFitness(list);
            return acc.fitness < fitness ? acc : {fitness, list}
        },
        {fitness: 100000, list: []},
        gesamtliste
    );

type Fitnesses = {fitness: number, list: number[][][]};

const findeBesteFitnesses = (gesamtliste: number[][][]): Fitnesses =>
    R.reduce(
        (acc: Fitnesses, list: number[][]) => {
            const fitness = bewerteFitness(list);
            return acc.fitness < fitness ? acc
                : acc.fitness === fitness ? {...acc, list: acc.list.concat([list])}
                    : {fitness, list: [list]}
        },
        {fitness: 100000, list: []},
        gesamtliste
    );


const distribute = (list: number[][], praefix: string = ""): number[][][] => {
    if(list.length <= 1) {
        return [];
    }

    const firstShiftable: number = 1 + R.findIndex((l:number[]) => l.length > 1, R.drop(1, list));
    if(firstShiftable === 0) {
        return [];
    }

    const [firstPart, secondPart]: [number[][], number[][]] = R.splitAt(firstShiftable, list);
    // second part contains the shiftable block as first entry
    const [front, toAddTo]: [number[][], number[][]] = R.splitAt(firstPart.length-1, firstPart);
    const [toRemoveFrom, back]: [number[][], number[][]] = R.splitAt(1, secondPart);
    const [move, removed]: [number[], number[]] = R.splitAt(1, toRemoveFrom[0]);
    const addedTo: number[][] = [toAddTo[0].concat(move)];

    // console.log(`${firstShiftable}: ${JSON.stringify(front)} - ${JSON.stringify(addedTo)} - ${JSON.stringify(removed)} - ${JSON.stringify(back)}`)

    const ersteRekursionListe = [removed].concat(back);
    const zweiteRekursionListe = addedTo.concat(ersteRekursionListe);
    const verschobeneListe = front.concat(zweiteRekursionListe);

    const neuerPraefix = `${praefix} ${firstShiftable}`;
    // erste Rekursion: Ohne das addedTo Element
    // console.log(`${neuerPraefix} ersteRekursion: ${JSON.stringify(verschobeneListe)}`)
    const endenErsteRekursion = ersteRekursionListe.length > 1 && ersteRekursionListe[1].length > 1 ?
        distribute(ersteRekursionListe, neuerPraefix) : [];

    // zweite Rekursion: Mit dem addedTo Element
    // console.log(`${neuerPraefix} zweiteRekursion: ${JSON.stringify(verschobeneListe)}`)
    const endenZweiteRekursion = addedTo.length > 0 ? distribute(zweiteRekursionListe, neuerPraefix) : [];


    // console.log(`${neuerPraefix} Rekursion: ${JSON.stringify(verschobeneListe)}`)
    const rekursion = front.length > 0 ? distribute(verschobeneListe, neuerPraefix) : [];

    return [verschobeneListe]
        .concat(rekursion)
        .concat(endenZweiteRekursion.length > 0 ? endenZweiteRekursion.map(l => front.concat(l)) : [])
        .concat(endenErsteRekursion.length > 0 ? endenErsteRekursion.map(l => front.concat(addedTo).concat(l)) : [])
        ;
}

const logResults = (anzahl: number, resultat: number[][][]): void => {
    const besteFitness: Fitness = findeBesteFitness(resultat);
    const seitenzahlen: number[] = besteFitness.list.map(summiereListe);

    const besteFitnesses = findeBesteFitnesses(resultat);
    const seitenzahlens = besteFitnesses.list.map(l => l.map(summiereListe))
    console.log(`${anzahl} Wochen:`)
    console.log(JSON.stringify(besteFitnesses))
    console.log(JSON.stringify(seitenzahlens))
    /*
    besteFitness.list.forEach((l, idx) => {
        console.log(`| ${l.toString().replace(/,/g, ", ")} | ${seitenzahlen[idx]} |`)
    })
     */
    besteFitnesses.list.forEach((l1, idx1) => {
        l1.forEach((l, idx) => {
            console.log(`| ${l.toString().replace(/,/g, ", ")} | ${seitenzahlens[idx1][idx]} |`)
        })
    })
}

const list6Wochen = [[1], [2], [3], [4], [5], [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]];
const resultat6: number[][][] = [list6Wochen].concat(distribute(list6Wochen));
const resultat6Unter20 = resultat6.filter(([l,]) => summiereListe(l) < 20)

logResults(6, resultat6);
logResults(6, resultat6Unter20);

const list7Wochen = [[1], [2], [3], [4], [5], [6], [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]];
const resultat7: number[][][] = [list7Wochen].concat(distribute(list7Wochen));
const resultat7Unter20 = resultat7.filter(([l,]) => summiereListe(l) < 20)

// logResults(7, resultat7);
logResults(7, resultat7Unter20);


// ----------------------------------------------------------------
const list8Wochen = [[1], [2], [3], [4], [5], [6], [7], [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]];
const resultat8: number[][][] = [list8Wochen].concat(distribute(list8Wochen));
const resultat8Unter20 = resultat8.filter(([l,]) => summiereListe(l) < 20)

// logResults(8, resultat8);
logResults(8, resultat8Unter20);
