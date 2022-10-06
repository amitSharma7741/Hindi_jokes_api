

# Hindi Jokes API

I created a REST API using node Js , express and MongoDB.  It uses the Hindi Jokes API to fetch random jokes in Hindi language. The app is deployed on Render.

[API Link](https://hindi-jokes-api.onrender.com)
```
  https://hindi-jokes-api.onrender.com
```
 
 

---

## <u>Custom Endpoints</u>

### Random joke
Endpoint: [/jokes](https://hindi-jokes-api.onrender.com/jokes)

Example: [https://hindi-jokes-api.onrender.com/jokes?api_key=YourApiKey](https://hindi-jokes-api.onrender.com/jokes?api_key=YourApiKey)

Response:

```jsonc
{
    "_id": "631c381d798f9e2887b4cba1",
    "status": "Success",
    "jokeContent": "आओ 2 Min मौन रखे उन लड़कियों के लिए.. जिनकी शक्ल Nokia 1100 जैसी है और घमंड Iphone14 जैसा…. 😆🤣😋😉",
    "jokeNo": 116,
    "created_by": "Amit Sharma"
}
```
### Specify count (MAX 50)

In order to get multiple jokes in a single request specify the count with the following endpoint.

Endpoint: [/jokes/{count}](https://hindi-jokes-api.onrender.com/jokes/2?api_key=YourApiKey)

Example: [https://hindi-jokes-api.onrender.com/jokes/2?api_key=YourApiKey](https://hindi-jokes-api.onrender.com/jokes/2?api_key=YourApiKey)

Response:

```jsonc
{
"status": "Success",
"created_by": "Amit Sharma",
"totalJokes": "2",
"data": [
   {
      "_id": "63199fb5f02231a5ee2965a5",
      "jokeContent": "शादी के दो दिन बाद दूल्हा उस ब्यूटी पार्लर में गया जहां से उसकी बीवी ने शादी के लिए मेकअप करवाया था उसने पार्लर वाली मैडम को आईफोन 7 गिफ्ट किया और थैंक्यू बोलकर चला                         आया मैडम ने खुशी खुशी आईफोन का डब्बा खोला तो उसमें नोकिया 1100 पड़ा था साथ में एक पर्ची भी थी जिस पर लिखा था मुझे भी ऐसा ही महसूस हुआ था😆🤣😋😉 ",
       "jokeNo": 71
   },
  {
       "_id": "63217239def3f928de48b025",
       "jokeContent": "थप्पड मारने पर नाराज वाईफ से हसबंड बोला:  ...आदमी उसी को मारता है जिससे वो प्यार करता है.   ..वाईफ ने हसबंड को 2 थप्पड मारे और बोली  ...आप क्या समझते है मै                          आपसे प्यार नही करती ... 😆🤣😋😉",
       "jokeNo": 141
   }
 ]
}
```
 
## Usage/Examples

**Using Fetch**
```javascript
 
const fetchData = async () => {
    const url = "https://hindi-jokes-api.onrender.com/jokes?api_key=YourApiKey"
    const response = await fetch(url);
    const data = await response.json();
    console.log(data)
}
 
```

**Using Axios**

```javascript
// First you need to intall axios
npm i axios

// use axios 
 
const sendGetRequest = async () => {
    const url = "https://hindi-jokes-api.onrender.com/jokes?api_key=YourApiKey"
    try {
        const resp = await axios.get(url);
        console.log(resp.data);
    } catch (err) {
        // Handle Error Here
        console.error(err);
    }
};
 
```

## Contributing

Contributions are always welcome!

See `contribute.md` for ways to get started.
 



## Authors

- [@amitSharma7741](https://github.com/amitSharma7741)





## 🚀 About Me
I'm a full stack web developer...


 
 




