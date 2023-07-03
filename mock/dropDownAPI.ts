const optionsItmes = [
  {
    "value": 0,
    "code": "0",
    "label": "寄售补货订单0"
  }, {
    "value": 1,
    "label": "寄售退货订单1"
  }, {
    "value": 2,
    "label": "寄售退货订单2"
  }, {
    "value": 3,
    "label": "寄售退货订单3"
  }, {
    "value": 4,
    "label": "寄售退货订单4"
  }, {
    "value": 5,
    "label": "寄售退货订单5"
  }, {
    "value": 6,
    "label": "寄售退货订单6"
  }, {
    "value": 7,
    "label": "寄售退货订单7"
  }, {
    "value": 8,
    "label": "寄售退货订单8"
  }, {
    "value": 9,
    "label": "寄售退货订单9"
  }, {
    "value": 10,
    "label": "寄售退货订单10"
  }, {
    "value": 11,
    "label": "寄售退货订单11"
  }, {
    "value": 12,
    "label": "寄售退货订单12"
  }, {
    "value": 13,
    "label": "寄售退货订单13"
  }, {
    "value": 14,
    "label": "寄售退货订单14"
  },
];

export default {
  'GET /api/dorpDown/roles': (req: any, res: any) => {
    const { pageIndex, pageSize } = req.query;

    const totalPage = Math.ceil(optionsItmes.length / parseInt(pageSize));

    let start = parseInt(pageIndex) * parseInt(pageSize);
    let end = start + parseInt(pageSize);

    if (end >= optionsItmes.length) {
      end = optionsItmes.length;
    }

    setTimeout(() => {
      res.json({
        success: true,
        data: optionsItmes.slice(start, end),
        totalPage: totalPage
      });
    }, 3000)
  }
};