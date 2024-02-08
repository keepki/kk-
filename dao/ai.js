var axios = require('axios');

exports.getAIResponse = function (query, res) {
    console.log(query)
    const headers = {
        'Content-Type': 'application/json',
        'X-Authorization': 'Bearer bce-v3/ALTAK-pIhhffRuOHykJEwtsomF8/e5d547547364c3fdd4a4294e912ac81d2f5bc7a8',
    };
    const requestBody = {
        query: query,
        response_mode: 'streaming',
    };

    axios.post('https://console.bce.baidu.com/api/ai_apaas/v1/instance/integrated', requestBody, {
        headers: headers
    })
    .then(response => {
        const aiReply = response.data;
        let jsonStrings = aiReply.split('data: ').filter(Boolean);
        let answers = jsonStrings.map(jsonString => {
                try {
                    const item = JSON.parse(jsonString);
                    return item.result && item.result.answer ? item.result.answer.trim() : null;
                } catch (error) {
                    console.error('ErrorJSON:', error);
                    return null;
                }
            })
            .filter(answer => answer !== null && answer !== '');

        let resdata = answers.join(',');
        console.log(resdata);
        res.send({
            status: 200,
            response: resdata
        });
    })
    .catch(error => {
        console.error('Error', error);
        res.status(500).send({
            status: 500,
            response: 'Server Error'
        });
    });
};
