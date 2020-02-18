// SPARQL検索ページに例として提示するクエリ
const tryQuery = [
  {
    "id": "R-Problem-All",
    "title": "「地域課題」一覧",
    "query": `PREFIX class:<http://socialproblem/class/>
        PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>
        select DISTINCT ?RegionalProblem{
          {
            ?RegionalProblem rdfs:subClassOf class:地域課題.
            }UNION{
            ?RegionalProblem2 rdfs:subClassOf class:地域課題.
            ?RegionalProblem rdfs:subClassOf ?RegionalProblem2.
          }
        }ORDER BY ?RegionalProblem2`
  },
  {
    "id": "Object-All",
    "title": "「目的」一覧",
    "query": `PREFIX class:<http://socialproblem/class/>
        PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>
        select DISTINCT ?Object{
          {
            ?Object rdfs:subClassOf class:目的.
            }UNION{
            ?Object2 rdfs:subClassOf class:目的.
            ?Object rdfs:subClassOf ?Object2.
          }
        }ORDER BY ?Object2`
  },
  {
    "id": "text-kodomo",
    "title": "取組名に「こども」が含まれるもの",
    "query": `select DISTINCT ?torikumi ?mokuteki ?kadai ?URL
        where {
          {
            ?torikumi ?p ?text FILTER regex (?text, "こども") .
            ?torikumi <http://socialproblem/property/解決する課題> ?kadai.
            ?torikumi <http://socialproblem/property/解決する目的> ?mokuteki.
            ?torikumi <http://socialproblem/property/URL> ?URL.
          }
        }`
  },
  {
    "id": "defaultQuery",
    "title": "デフォルトクエリ",
    "query": "select ?s ?p ?o {?s ?p ?o} LIMIT 100"
  }
];

window.addEventListener('load', () => {
  const TryQueryArea = document.getElementById('TryQuery');
  tryQuery.map(query => {
    const button = document.createElement('button');
    button.className = 'try_button';
    button.id = query.id;
    button.innerText = query.title;
    button.value = query.query;
    TryQueryArea.appendChild(button);
    clickEvent(query.id, query.query);
  }, false);

}, false);

/**
 * 押されたボタンを判定し、クエリエリアにクエリを出力
 * @param {String} id 
 * @param {String} query 
 */
function clickEvent(id, query) {
  document.getElementById(id).addEventListener('click', () => {
    textArea.value = '';
    textArea.value = query;
  }, false);
}