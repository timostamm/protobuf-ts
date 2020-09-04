import {performance, PerformanceObserver} from "perf_hooks";



function bench(name: string, fn: () => void, durationSeconds = 10) {
    let startTs = performance.now();
    let endTs = startTs + durationSeconds * 1000;
    let samples = 0;
    while (performance.now() < endTs) {
        fn();
        samples++;
    }
    let durationMs = performance.now() - startTs;
    let opsPerSecond = 1000 / (durationMs / samples);
    console.log(`${name}: ${Math.round(opsPerSecond * 100) / 100} ops/s on average over ${samples} samples`);
}


// ---

let object = {
    longList: [] as number[],
    bigObject: {} as any,
};
for (let i = 0; i < 100 * 1000; i++) {
    object.longList.push(Math.random());
}
for (let i = 0; i < 25; i++) {
    object.bigObject['x' + i] = Math.random();
}
let fakeOpX = 0;

function fakeOp(arg: any) {
    if (typeof arg == 'number') {
        fakeOpX += arg;
    }
}


// ---

bench('object: for ... of Object.entries()', () => {
    for (let [k, v] of Object.entries(object.bigObject)) {
        fakeOp(k);
        fakeOp(v);
    }
});

bench('object: for ... of Object.keys()', () => {
    for (let k of Object.keys(object.bigObject)) {
        fakeOp(k);
        fakeOp(object.bigObject[k]);
    }
});

bench('object: for ... of globalThis.Object.keys()', () => {
    for (let k of globalThis.Object.keys(object.bigObject)) {
        fakeOp(k);
        fakeOp(object.bigObject[k]);
    }
});

bench('object: for var ... of Object.keys()', () => {
    for (var k of Object.keys(object.bigObject)) {
        fakeOp(k);
        fakeOp(object.bigObject[k]);
    }
});

bench('object: for const ... of Object.keys()', () => {
    for (const k of Object.keys(object.bigObject)) {
        fakeOp(k);
        fakeOp(object.bigObject[k]);
    }
});

bench('object: for Object.keys()', () => {
    let keys = Object.keys(object.bigObject);
    for (let i = 0; i < keys.length; i++) {
        fakeOp(keys[i]);
        fakeOp(object.bigObject[keys[i]]);
    }
});


bench('object: for in with hasOwnProperty', () => {
    for (let k in object.bigObject) {
        if (object.bigObject.hasOwnProperty(k)) {
            fakeOp(k);
            fakeOp(object.bigObject[k]);
        }
    }
});



bench('array for of', () => {
    for (let i of object.longList)
        fakeOp(object.longList[i]);
});

bench('array for', () => {
    for (let i = 0; i < object.longList.length; i++)
        fakeOp(object.longList[i]);
});
