module.exports = {
  getData: function(req, res) {
      const request = require('superagent');
      const url = 'http://104.40.201.156/_node/stats/pipelines';
      const Res = res;
      request
        .get(url)
        .then((res) => {
            return Res.send(res.body);
        })
        .catch( (err) => {
            return Res.send({error: err});
        })
  }

}
