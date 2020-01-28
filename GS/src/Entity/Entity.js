/**
 * ドロップダウンリスト用のクラスビルダー
 * @param {*} obj 
 * @return {s}
 */
function buildSelectList(obj) {
    const List = new ListClass();
    List.s = buildObject(obj["s"]);
    return List;
}

/**
 * SPARQL検索の結果のクラスビルダー
 * @param {*} obj 
 * @return {Bindings}
 */
function buildSPARQLBindings(obj, vars) {
    const bindings = new Bindings();
    bindings.s = buildObject(obj[vars[0]]);
    bindings.p = buildObject(obj[vars[1]]);
    bindings.o = buildObject(obj[vars[2]]);
    return bindings;
}

/**
 * キーワード検索結果のクラスビルダー1
 * @param {*} obj 
 * @return {KeySearchClass}
 */
function buildKeySearchRes(obj, vars) {
    const bindings = new KeySearchClass();
    bindings.torikumi = buildObject(obj[vars[0]]);
    bindings.theme1 = buildObject(obj[vars[1]]);
    bindings.URL = buildObject(obj[vars[2]]);
    return bindings;
}

/**
 * キーワード検索結果のクラスビルダー2
 * @param {*} obj 
 * @return {KeySearchClass}
 */
function buildKeySearchRes2(obj, vars) {
    const bindings = new KeySearchClass();
    bindings.torikumi = buildObject(obj[vars[0]]);
    bindings.theme1 = buildObject(obj[vars[1]]);
    bindings.theme2 = buildObject(obj[vars[2]]);
    bindings.URL = buildObject(obj[vars[3]]);
    return bindings;
}

/**
 * 
 * @param {*} obj 
 * @return {ResponseValue}
 */
function buildObject(obj) {
    return new ResponseValue(obj["type"], obj["value"], obj["xml:lang"]);
}


class ListClass {//ドロップダウンリスト用のクラス
    constructor() {
        this.s = {};
    }
}

class KeySearchClass {//キーワード検索結果のクラス
    constructor() {
        this.torikumi = {};
        this.theme1 = {};
        this.theme2 = {};
        this.URL = {};
    }
}

class Bindings {//キーワード検索結果のクラス
    constructor() {
        this.s = {};
        this.p = {};
        this.o = {};
    }
}

class ResponseValue {//汎用クラス
    constructor(type, value, xmllang) {
        this.type = type;
        type = 'literal' || 'uri';
        this.value = value;
        value = "" || 0;
        this.xmllang = xmllang;
        xmllang = "";
    }
}

class SparqlResponse {//???
    constructor() {
        this.vars = String;
        this.bindings = ['', ResponseValue];
    }
}


//以下、最終的に不要であれば削除可
class SolutionCase {//解決のための取組
    constructor() {
        this.objectiveProblem = []; //課題の目的
    }
}

class Problem {//各課題
    constructor() {
        this.subject = []; //課題の対象
        this.relationalTags = []; //課題に関係している事柄
    }
}

class Objective {
    constructor() {
        //
    }
}

class Subject {//課題や取組の対象
    constructor() {
        //
    }
}

class Tag {//付随する事柄
    constructor() {
        //
    }
}
