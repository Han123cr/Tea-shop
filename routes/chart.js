var express = require('express');
const { route } = require('.');
var router = express.Router();

//---------------------Trang chính--------------------------------------//
router.get('/', async (req, res) => {
    const barchart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            datasets: [{
                label: '# of Votes',
                data: [12, 19, 3, 5, 2, 3],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    res.render('chart', { barchart });
})
module.exports = router;
