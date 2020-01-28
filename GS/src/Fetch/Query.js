/**
 * ドロップダウンリスト用のクエリを作成
 * @param {Array} array 
 * @return {Array}
 */
function ListQuery(array) {
  return array.map(k => "select ?s {?s <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://socialproblem/class/" + k + ">} ");
}

/**
 * カテゴリ別検索用のキーワードを取得するクエリ
 * 共通
 * @param {String} category 
 * @return {String}
 */
function categoryQuery(category) {
  // return `select ?s {?s <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://socialproblem/class/${category}>} `;
  return `PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>
  PREFIX sp:<http://socialproblem/class/>
  
  select DISTINCT ?k ?s{
    {
      ?s rdfs:subClassOf sp:${category}.
    }UNION{
      ?k rdfs:subClassOf sp:${category}.
      ?s rdfs:subClassOf ?k.
    }UNION{
      ?k rdfs:subClassOf sp:${category}.
      ?k2 rdfs:subClassOf ?k.
      ?s rdfs:subClassOf ?k2.
    }UNION{
      ?k rdfs:subClassOf sp:${category}.
      ?k2 rdfs:subClassOf ?k.
      ?k3 rdfs:subClassOf ?k2.
      ?s rdfs:subClassOf ?k3.
    }
  }ORDER BY ?k ?k2`;
}

/**
 * 課題から検索したときのクエリ
 * @param {String} value 
 */
function QueryTypeProblem(value) {
  return `PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>
    PREFIX spclass:<http://socialproblem/class/>
    PREFIX spprop:<http://socialproblem/property/>
    select DISTINCT ?torikumi ?Kadai ?mokuteki ?URL
    where {
      {
          spclass:${value} spprop:取組・対策 ?torikumi;
          spprop:解決する目的 ?mokuteki.
          ?Kadai rdfs:label "${value}"@ja.
          ?torikumi spprop:URL ?URL.
      }UNION{
        ?kadai rdfs:subClassOf spclass:${value};
                  spprop:取組・対策 ?torikumi;
                  spprop:解決する目的 ?mokuteki.
        ?kadai rdfs:label ?Kadai.
        FILTER(LANG(?Kadai)='ja')
        ?torikumi spprop:URL ?URL.
      }UNION{
        ?kadai1 rdfs:subClassOf spclass:${value}.
        ?kadai2 rdfs:subClassOf ?kadai1;
                  spprop:取組・対策 ?torikumi;
                  spprop:解決する目的 ?mokuteki;
                  rdfs:label ?Kadai.
        FILTER(LANG(?Kadai)='ja')
        ?torikumi spprop:URL ?URL.
      }UNION{
        ?kadai1 rdfs:subClassOf spclass:${value}.
        ?kadai2 rdfs:subClassOf ?kadai1.
        ?kadai3 rdfs:subClassOf ?kadai2;
                  spprop:取組・対策 ?torikumi;
                  spprop:解決する目的 ?mokuteki;
                  rdfs:label ?Kadai.
        FILTER(LANG(?Kadai)='ja')
        ?torikumi spprop:URL ?URL.
      }UNION{
        ?kadai1 rdfs:subClassOf spclass:${value}.
        ?kadai2 rdfs:subClassOf ?kadai1.
        ?kadai3 rdfs:subClassOf ?kadai2.
        ?kadai4 rdfs:subClassOf ?kadai3;
                  spprop:取組・対策 ?torikumi;
                  spprop:解決する目的 ?mokuteki;
                  rdfs:label ?Kadai.
        FILTER(LANG(?Kadai)='ja')
        ?torikumi spprop:URL ?URL.
      }
    }order by ?torikumi`;
}

/**
 * 目的から検索したときのクエリ
 * @param {String} value 
 */
function QueryTypeObject(value) {
  return `PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>
    PREFIX spclass:<http://socialproblem/class/>
    PREFIX spprop:<http://socialproblem/property/>
    select DISTINCT ?torikumi ?kadai ?Mokuteki ?URL
    where {
      {
        spclass:${value} spprop:取組・対策 ?torikumi;
                  spprop:解決する課題 ?kadai.
        ?Mokuteki rdfs:label "${value}"@ja.
        ?torikumi spprop:URL ?URL.
      }UNION{
        ?mokuteki rdfs:subClassOf spclass:${value};
                  spprop:取組・対策 ?torikumi;
                  spprop:解決する課題 ?kadai;
                  rdfs:label ?Mokuteki.
        FILTER(LANG(?Mokuteki)='ja')
        ?torikumi spprop:URL ?URL.
      }UNION{
        ?mokuteki1 rdfs:subClassOf spclass:${value}.
        ?mokuteki2 rdfs:subClassOf ?mokuteki1;
                  spprop:取組・対策 ?torikumi;
                  spprop:解決する課題 ?kadai;
                  rdfs:label ?Mokuteki.
        FILTER(LANG(?Mokuteki)='ja')
        ?torikumi spprop:URL ?URL.
      }UNION{
        ?mokuteki1 rdfs:subClassOf spclass:${value}.
        ?mokuteki2 rdfs:subClassOf ?mokuteki1.
        ?mokuteki3 rdfs:subClassOf ?mokuteki2;
                  spprop:取組・対策 ?torikumi;
                  spprop:解決する課題 ?kadai;
                  rdfs:label ?Mokuteki.
        FILTER(LANG(?Mokuteki)='ja')
        ?torikumi spprop:URL ?URL.
      }UNION{
        ?mokuteki1 rdfs:subClassOf spclass:${value}.
        ?mokuteki2 rdfs:subClassOf ?mokuteki1.
        ?mokuteki3 rdfs:subClassOf ?mokuteki2.
        ?mokuteki4 rdfs:subClassOf ?mokuteki3;
                  spprop:取組・対策 ?torikumi;
                  spprop:解決する課題 ?kadai;
                  rdfs:label ?Mokuteki.
        FILTER(LANG(?Mokuteki)='ja')
        ?torikumi spprop:URL ?URL.
      }
    }order by ?torikumi`;
}

/**
 * 対象から検索したときのクエリ
 * @param {String} value 
 */
function QueryTypeSubject(value) {
  return `
    PREFIX spclass:<http://socialproblem/class/>
    PREFIX spprop:<http://socialproblem/property/>
    select DISTINCT ?torikumi ?mokuteki ?kadai ?URL
    where {
      {
        ?subject ?p ?text FILTER regex (?text, "${value}", "i") .
        ?torikumi <http://socialproblem/property/対象> ?subject.
        ?torikumi spprop:解決する課題 ?kadai.
        ?torikumi spprop:解決する目的 ?mokuteki.
        ?torikumi spprop:URL ?URL.
      }
    }`;
}

/**
 * 入力されたキーワードを組み込むクエリ
 * @param {String} value 
 */
function KeySearchQuery(value) {
  return `
        PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>
        PREFIX rdfs:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX spclass:<http://socialproblem/class/>
        PREFIX spprop:<http://socialproblem/property/>
        select DISTINCT ?torikumi ?kadai ?mokuteki ?URL
        where{
        {
            ?keyword ?p ?text FILTER regex (?text, "${value}", "i") .
            ?keyword spprop:取組・対策 ?torikumi.
            ?torikumi spprop:URL ?URL;
                    spprop:解決する課題 ?kadai;
                    spprop:解決する目的 ?mokuteki.
        }UNION{
            ?torikumi ?p ?text FILTER regex (?text, "${value}", "i") .
            ?torikumi spprop:URL ?URL;
                    spprop:解決する課題 ?kadai;
                    spprop:解決する目的 ?mokuteki.
        }
    }order by ?torikumi`;
}


/**
 * エンドポイントにクエリを送信しレスポンスを受け取る関数
 * @param {String} query 
 */
async function fetchQuery(query) {
  const endpoint = "//lod.hozo.jp/repositories/SocialProblem";
  try {
    const result = await sendQuery(endpoint, query); //エンドポイントにクエリを送信
    if (!result.ok) { //resultがOKじゃないとき
      resultArea.innerText = "クエリが正しくないか、サーバがおかしいみたいです。";
      return;
    }
    const resultData = await result.json();
    return resultData;
  } catch (e) {
    resultArea.innerText = e.message;
    throw e;
  }
}