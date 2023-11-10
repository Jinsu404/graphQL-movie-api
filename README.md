# graphQL-movie-api
노마드코더의 graphQL로 movie api 만들기 강의를 따라해 봤습니다.<br>
https://ordinary-pasta-500.notion.site/f6bf779253d84bb587a024f9eec5d13b?pvs=4
<br>
---

# graphQL이 REST api 보다 좋은점
- overfetching , underfetching   
overfetching 은 원하는것보다 너무많은 데이터를 주는것   
underfetching은 원하는 데이터를 얻을려면 api 호출을 여러번 해야 하는것   
REST api에는 이 두 문제가 있는데 이를 개선해서 원하는 데이터만 골라서 한번의 요청에 받아올수 있는것이 graphQL이다
<br><br>
---

# graphQL과 nodemon 설치하는법
```
npm install apollo-server graphql
npm install nodemon -D
```
따로 설치는 필요없고 이 코드를 프로젝트에 설치하면 된다 <br>
노드몬은 자동으로 빌드를 해주는 아주 좋은 녀석이다 <br>
<br>
---
# api를 개발할 서버 구축
<img width="290" alt="image" src="https://github.com/Jinsu404/graphQL-movie-api/assets/137613256/f34f7ca9-ea37-4f73-b687-b97874d9e0ac"> <br>
- scripts 에 "dev": "nodemon server.js" 를 추가
- 마지막에 "type": "module" 을 추가<br><br>
```import { ApolloServer,gql } from "apollo-server";```<br>
type:module 을 추가하면 바뀌는점은 위 처럼 import 가능<br>
```const { ApolloServer, gql } = require("apollo-server")```<br>
하지 않았을시 이렇게 import 해야하는데 취향차이라고 한다<br>

---
# api 개발

```
import { ApolloServer, gql } from "apollo-server";

const server = new ApolloServer();

server.listen().then(({ url }) => {
  console.log(`running on ${url}`);
});

```   
처음 이렇게 시작하는데 오류가 뜬다
![image](https://github.com/Jinsu404/graphQL-movie-api/assets/137613256/de3680a2-1e3b-42d5-a2d8-de4b5da0ff5d)

- 그이유
  - graphQL에서는 데이터 타입을 필수로 설정해야 하는데 아직 하지 않았기 때문이다

```
const typeDefs = gql`SDL`
```
SDL : scheme definition language   
이걸 선언하고  SDL로 타입을 지정하면 돤다   
SDL에는 type Query 가 필수적으로 들어가야 한다   
type Query는 REST api에서 get 의 역할임   
사용자가 request 하도록 하려면  type Query에 무조건 지정되어 있어야한다  

### query type

```
const typeDefs = gql`
    type Query {
        text: String
    }
`;
```
이 코드는 REST api의 ```GET /text``` 과 같다   

```
const typeDefs = gql`
    type Tweet {
        id: ID
        text: String
    }
    type Query {
        allTweets : [Tweet]
    }
`;
```
이러한 코드를 실행하고 싶다면
![image](https://github.com/Jinsu404/graphQL-movie-api/assets/137613256/4d036dc5-fc15-4caa-b831-cf7fe8c4b25e)   
이런식으로 사용 할 수 있다   


```
allTweets : [Tweet]
tweet(id: ID): Tweet
```
모든 트윗을 보여주는 함수와 특정 트윗을 보여주는 함수   
   
특정 타입을 보여주고 싶다면 () 안에 필요한 인자를 넣으면 된다
```GET /api/vi/tweets/:id```와 같은 기능

### Mutation Type   
Mutationt type은 REST api에서 POST DELETE PUT 의 역할을 하는 기능을 만들때 여기다 넣으면 된다   
```
type Mutation {
    postTweet(text:String , userId: ID): Tweet
    deleteTweet(id: ID): Boolean
  }
```
새 트윗을 등록하는것과 트윗을 삭제하는 기능

### Nullable

```
allUsers: [User!]!
    allTweets: [Tweet!]!
    tweet(id: ID!): Tweet
```
!를 변수 뒤에 붙이면 그 변수는 필수적으로 있어야 할 때 쓴다   
붙이지 않으면 null 상태여도 괜찮음   

### Resolver
Resolver 에서는 typeRefs 에서 정의했던 타입들을 가지고 직접 사용자가 실행했을때 리턴해주는 용도이다   
```
tweet(root, { id }) {
      return tweets.find((tweet) => tweet.id === id);
    },
```
특정 1개의 트윗을 찾아서 보여주는 기능   
resolver에서는 인자로 첫번쨰는 root , 두번째는 args를 가질수 있다 (순서는 고정)  
root 는 사용한 타입이 가리키는? 데이터베이스에 있는 값을 인자로 가짐   
args는 사용자가 입력한 값을 갖는다   



# 최종 구현 연습
![image](https://github.com/Jinsu404/graphQL-movie-api/assets/137613256/243629cb-101d-4b3c-b515-cf21f5e05075)


   
___

# ytx.mx 사이트의 api 를 활용해 movie 데이터를 추출하여 사용하기   
https://yts.mx/api/v2/list_movies.json 를 주소에 입력하여 들어가면 json 데이터가 나오는데   
   
https://transform.tools/json-to-graphql 이 사이트에서 변환하여 movie의 타입을 추출할 수 있다

```
type Movie {
    id: Int!
    url: String!
    imdb_code: String!
    title: String!
    title_english: String!
    title_long: String!
    slug: String!
    year: Int!
    rating: Float!
    runtime: Int!
    summary: String!
    description_full: String!
    synopsis: String!
    language: String!
    mpa_rating: String!
    background_image: String!
    large_cover_image: String!
    state: String!
    genres: [String]!
  }
```
이런식으로 추출한 데이터를 graphQL의 타입으로 정의   

```
type Query {
    allMovie: [Movie]
    allUsers: [User!]!
    allTweets: [Tweet!]!
    tweet(id: ID!): Tweet
  }
```
query type에 모든 영화에 대한 정보를 보내주는 함수를 만들고   
```
async allMovie() {
      const res = await fetch("https://yts.mx/api/v2/list_movies.json");
        const json = await res.json();
        return json.data.movies;
    },
```
resolver에 사용자에게 리턴할 내용을 yts 사이트에서 추출하여 리턴해주는 코드   
![image](https://github.com/Jinsu404/graphQL-movie-api/assets/137613256/78382740-fbf2-48e9-9aef-f2d02c41ad56)

___
    
### 개선할점
아직 데이터베이스를 모르기 때문에 인터넷에있는 데이터를 활용해서만 했는데 데이터 베이스를 공부한다면 나의 데이터베이스를 구축해서 백엔드를 더 공부하고싶다   

### 느낀점
뭔가 타입스크립트랑 비슷한거같다



