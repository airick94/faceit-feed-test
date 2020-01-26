const baseUrl = "https://my-json-server.typicode.com/airick94/faceit-feed-test-server/";

export async function getData(url) {
    let response = await fetch(`${baseUrl}/${url}?page=1&per_page=10`);
    let responseJson = await response.json();
    return {
        status: response.status,
        data: responseJson,
    };
}

export async function postData(url, postData) {
    let response = await fetch(`${baseUrl}/${url}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(postData), // body data type must match "C
    });
    let responseJson = await response.json();
    console.log(responseJson);
}
