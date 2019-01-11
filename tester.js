'use strict';

const fs = require('fs');
const moment = require('moment')


const firstBlDate = moment(2008, 'YYYY').format('x')
const firstMsDate = moment(2009, 'YYYY').format('x')
const blDateRows = [];
const singleRow = typeof firstBlDate
