const http = require('http');

const todos = [
    {id: 0, text: 'Todo Index'},
    {id: 1, text: 'Todo 1st'},
    {id: 2, text: 'Todo 2nd'},
    {id: 3, text: 'Todo 3rd'}
];

const server = http.createServer((req, res) => {
    // console.log(req);
    // console.log('Headers:', headers);
    // console.log('Method:', method);
    // console.log('URL:', url);
    // res.statusCode = 404;
    
    // res.setHeader('Content-Type', 'application/json');
    // res.setHeader('X-Powered-By', 'Node.js');

    const {method, url} = req;

    let body = [];

    req.on('data', chunk => {
        body.push(chunk);
    }).on('end', () => {
        body = Buffer.concat(body).toString();

        let status = 404;
        const response = {
            success: false,
            results: [],
            error: '',
        };

        if(method === 'GET' && url === '/todos'){
            status = 200;
            response.success = true;
            response.results = todos;
        } else if(method === 'POST' && url === '/todos'){
            const { id, text } = JSON.parse(body);
            const todoCount = todos.length - 1; //not in module
            if(!id && !text){
                status = 400;
                response.error = 'Please add id and text';
            } else if(id > todoCount){
                // not in module
                status = 400;
                response.error = `There is no todo ${id}`;
            } else{
                todos.push({id, text});
                status = 201;
                response.success = true;
                response.results = todos[id];
            };
        };

        res.writeHead(status, {
            'Content-Type': 'application/json',
            'X-Powered-By': 'Node.js'
        });

        res.end(JSON.stringify(response));
    });
});

const port = 5000;

server.listen(port, () => console.log(`Server running on port ${port}`));