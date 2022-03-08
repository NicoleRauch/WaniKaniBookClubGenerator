import * as R from "ramda";

const kapitelseiten: Record<number, number> = {
    1: 11.5,
    2: 19,
    3: 13,
    4: 8,
    5: 14,
    6: 8,
    7: 11.5,
    8: 8,
    9: 17,
    10: 14,
    11: 7.5,
    12: 13,
    13: 10.5,
    14: 7.5,
    15: 11.5,
    16: 10.5,
    17: 9,
    18: 4,
};

const get = (list: number[][], index: number): number[] => list[index] || [];

const summiereKapitelseiten = (list: number[] | undefined): number =>
    list === undefined ? 0 : R.sum(list.map(e => kapitelseiten[e] || 0));

const calcMaximumProWoche = (list: number[][]): number =>
    R.reduce(
        (acc: number, elem: number[]) => R.max(summiereKapitelseiten(elem), acc),
        0,
        list);

const calcMinimumProWoche = (list: number[][]): number =>
    R.reduce(
        (acc: number, elem: number[]) => R.min(summiereKapitelseiten(elem), acc),
        10000,
        list);

// const fitnessListe = (list: number[][][]): number[] =>
//     list.map(maximumProWoche);

// type Fitness = { fitness: number, list: number[][] };


// const findeBesteFitness = (gesamtliste: number[][][]): Fitness =>
//     R.reduce(
//         (acc: Fitness, list: number[][]) => {
//             const fitness = maximumProWoche(list);
//             return acc.fitness < fitness ? acc : {fitness, list};
//         },
//         {fitness: 100000, list: []},
//         gesamtliste
//     );

type Fitnesses = { maximum: number, minimum: number, list: number[][][] };

const findeBesteFitnesses = (gesamtliste: number[][][]): Fitnesses =>
    R.reduce(
        (acc: Fitnesses, list: number[][]) => {
            const maximumProWoche = calcMaximumProWoche(list);
            const minimumProWoche = calcMinimumProWoche(list);
            return acc.maximum < maximumProWoche || acc.minimum > minimumProWoche
                   ? acc
                   : acc.maximum === maximumProWoche && acc.minimum === minimumProWoche
                     ? {...acc, list: acc.list.concat([list])}
                     : {maximum: maximumProWoche, minimum: minimumProWoche, list: [list]};
        },
        {maximum: 100000, minimum: 0, list: []},
        gesamtliste
    );


const distribute = (list: number[][], praefix: string = ""): number[][][] => {
    if (list.length <= 1) {
        return [];
    }

    const firstShiftable: number = 1 + R.findIndex((l: number[]) => l.length > 1, R.drop(1, list));
    if (firstShiftable === 0) {
        return [];
    }

    const [firstPart, secondPart]: [number[][], number[][]] = R.splitAt(firstShiftable, list);
    // second part contains the shiftable block as first entry
    const [front, toAddTo]: [number[][], number[][]] = R.splitAt(firstPart.length - 1, firstPart);
    const [toRemoveFrom, back]: [number[][], number[][]] = R.splitAt(1, secondPart);
    const [move, removed]: [number[], number[]] = R.splitAt(1, get(toRemoveFrom, 0));
    const addedTo: number[][] = [get(toAddTo, 0).concat(move)];

    // console.log(`${firstShiftable}: ${JSON.stringify(front)} - ${JSON.stringify(addedTo)} - ${JSON.stringify(removed)} - ${JSON.stringify(back)}`)

    const ersteRekursionListe = [removed].concat(back);
    const zweiteRekursionListe = addedTo.concat(ersteRekursionListe);
    const verschobeneListe = front.concat(zweiteRekursionListe);

    const neuerPraefix = `${praefix} ${firstShiftable}`;
    // erste Rekursion: Ohne das addedTo Element
    // console.log(`${neuerPraefix} ersteRekursion: ${JSON.stringify(verschobeneListe)}`)
    const endenErsteRekursion = ersteRekursionListe.length > 1 && get(ersteRekursionListe, 1).length > 1 ?
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
};

const logResults = (anzahl: number, resultat: number[][][]): void => {
    // const besteFitness: Fitness = findeBesteFitness(resultat);
    // const seitenzahlen: number[] = besteFitness.list.map(summiereKapitelseiten);

    const besteFitnesses = findeBesteFitnesses(resultat);
    const seitenzahlens = besteFitnesses.list.map(l => l.map(summiereKapitelseiten));
    console.log(`${anzahl} Wochen:`);
    console.log(JSON.stringify(besteFitnesses));
    console.log(JSON.stringify(seitenzahlens));
    /*
    besteFitness.list.forEach((l, idx) => {
        console.log(`| ${l.toString().replace(/,/g, ", ")} | ${seitenzahlen[idx]} |`)
    })
     */
    besteFitnesses.list.forEach((l1, idx1) => {
        l1.forEach((l, idx) => {
            console.log(`| ${l.toString().replace(/,/g, ", ")} | ${get(seitenzahlens, idx1)[idx]} |`);
        });
    });
};

/*
const list6Wochen = [[1], [2], [3], [4], [5], [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]];
const resultat6: number[][][] = [list6Wochen].concat(distribute(list6Wochen));
const resultat6Unter20 = resultat6.filter(([l,]) => summiereKapitelseiten(l) < 20);

logResults(6, resultat6);
logResults(6, resultat6Unter20);

const list7Wochen = [[1], [2], [3], [4], [5], [6], [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]];
const resultat7: number[][][] = [list7Wochen].concat(distribute(list7Wochen));
const resultat7Unter20 = resultat7.filter(([l,]: number[][]) => summiereKapitelseiten(l) < 20);

// logResults(7, resultat7);
logResults(7, resultat7Unter20);


// ----------------------------------------------------------------
const list8Wochen = [[1], [2], [3], [4], [5], [6], [7], [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]];
const resultat8: number[][][] = [list8Wochen].concat(distribute(list8Wochen));
const resultat8Unter20 = resultat8.filter(([l,]) => summiereKapitelseiten(l) < 20);

// logResults(8, resultat8);
logResults(8, resultat8Unter20);
*/

const list10Wochen = [[1], [2], [3], [4], [5], [6], [7], [8], [9], [10, 11, 12, 13, 14, 15, 16, 17, 18]];
// const list11Wochen = [[1], [2], [3], [4], [5], [6], [7], [8], [9], [10], [11, 12, 13, 14, 15, 16, 17, 18]];
// const list12Wochen = [[1], [2], [3], [4], [5], [6], [7], [8], [9], [10], [11], [12, 13, 14, 15, 16, 17, 18]];
// const list13Wochen = [[1], [2], [3], [4], [5], [6], [7], [8], [9], [10], [11], [12], [13, 14, 15, 16, 17, 18]];
// const list14Wochen = [[1], [2], [3], [4], [5], [6], [7], [8], [9], [10], [11], [12], [13], [14, 15, 16, 17, 18]];
const listWochen = list10Wochen;
const resultat: number[][][] = [listWochen].concat(distribute(listWochen));
// const resultatUnter20 = resultat.filter(([l,]) => summiereKapitelseiten(l) < 20);

console.log("Result")
logResults(listWochen.length, resultat);
// console.log("Result unter 20")
// logResults(listWochen.length, resultatUnter20);
