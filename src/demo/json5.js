export default {
	"list": [
		{
			"type": "divider",
			"icon": "icon-fengexian",
			"options": {
				"hidden": false,
				"contentPosition": "left",
				"remoteFunc": "func_8hwswegx",
				"remoteOption": "option_8hwswegx"
			},
			"name": "主表省市区联动",
			"key": "8hwswegx",
			"model": "divider_8hwswegx",
			"rules": []
		},
		{
			"type": "select",
			"icon": "icon-select",
			"options": {
				"defaultValue": "",
				"multiple": false,
				"disabled": false,
				"clearable": false,
				"placeholder": "",
				"required": false,
				"requiredMessage": "",
				"validatorCheck": false,
				"validator": "",
				"showLabel": false,
				"width": "",
				"options": [
					{
						"value": "1111"
					},
					{
						"value": "2222"
					},
					{
						"value": "3333"
					}
				],
				"remote": true,
				"remoteType": "datasource",
				"remoteOption": "option_fsorqbls",
				"filterable": false,
				"remoteOptions": [],
				"props": {
					"value": "id",
					"label": "name"
				},
				"remoteFunc": "func_fsorqbls",
				"customClass": "",
				"labelWidth": 100,
				"isLabelWidth": false,
				"hidden": false,
				"dataBind": true,
				"tableColumn": false,
				"remoteDataSource": "8dl33dn7",
				"remoteArgs": {
					"fid": ""
				}
			},
			"events": {
				"onChange": "99wd1n9f",
				"onFocus": "",
				"onBlur": "",
				"onMounted": ""
			},
			"name": "省",
			"key": "fsorqbls",
			"model": "province",
			"rules": []
		},
		{
			"type": "select",
			"icon": "icon-select",
			"options": {
				"defaultValue": "",
				"multiple": false,
				"disabled": false,
				"clearable": false,
				"placeholder": "",
				"required": false,
				"requiredMessage": "",
				"validatorCheck": false,
				"validator": "",
				"showLabel": false,
				"width": "",
				"options": [
					{
						"value": "1111"
					},
					{
						"value": "2222"
					},
					{
						"value": "3333"
					}
				],
				"remote": true,
				"remoteType": "datasource",
				"remoteOption": "option_ilx7spgg",
				"filterable": false,
				"remoteOptions": [],
				"props": {
					"value": "id",
					"label": "name"
				},
				"remoteFunc": "func_ilx7spgg",
				"customClass": "",
				"labelWidth": 100,
				"isLabelWidth": false,
				"hidden": false,
				"dataBind": true,
				"tableColumn": false,
				"remoteDataSource": "8dl33dn7",
				"remoteArgs": {
					"fid": "{{ this.getValue(\"province\")}}"
				}
			},
			"events": {
				"onChange": "x3ctac19",
				"onFocus": "",
				"onBlur": "",
				"onMounted": ""
			},
			"name": "市",
			"key": "ilx7spgg",
			"model": "city",
			"rules": []
		},
		{
			"type": "select",
			"icon": "icon-select",
			"options": {
				"defaultValue": "",
				"multiple": false,
				"disabled": false,
				"clearable": false,
				"placeholder": "",
				"required": false,
				"requiredMessage": "",
				"validatorCheck": false,
				"validator": "",
				"showLabel": false,
				"width": "",
				"options": [
					{
						"value": "1111"
					},
					{
						"value": "2222"
					},
					{
						"value": "3333"
					}
				],
				"remote": true,
				"remoteType": "datasource",
				"remoteOption": "option_w0k4bvqu",
				"filterable": false,
				"remoteOptions": [],
				"props": {
					"value": "id",
					"label": "name"
				},
				"remoteFunc": "func_w0k4bvqu",
				"customClass": "",
				"labelWidth": 100,
				"isLabelWidth": false,
				"hidden": false,
				"dataBind": true,
				"tableColumn": false,
				"remoteDataSource": "8dl33dn7",
				"remoteArgs": {
					"fid": "{{ this.getValue(\"city\")}}"
				}
			},
			"events": {
				"onChange": "",
				"onFocus": "",
				"onBlur": "",
				"onMounted": ""
			},
			"name": "区",
			"key": "w0k4bvqu",
			"model": "district",
			"rules": []
		},
		{
			"type": "divider",
			"icon": "icon-fengexian",
			"options": {
				"hidden": false,
				"contentPosition": "left",
				"remoteFunc": "func_p7dp4c6l",
				"remoteOption": "option_p7dp4c6l",
				"tableColumn": false
			},
			"name": "子表省市区联动",
			"key": "p7dp4c6l",
			"model": "divider_p7dp4c6l",
			"rules": []
		},
		{
			"type": "table",
			"icon": "icon-kebianjibiaoge",
			"options": {
				"defaultValue": [],
				"customClass": "",
				"labelWidth": 100,
				"isLabelWidth": false,
				"hidden": false,
				"dataBind": true,
				"disabled": false,
				"required": false,
				"validatorCheck": false,
				"validator": "",
				"paging": true,
				"pageSize": 5,
				"isAdd": true,
				"isDelete": true,
				"showControl": true,
				"virtualTable": false,
				"tip": "",
				"remoteFunc": "func_31f7e1hl",
				"remoteOption": "option_31f7e1hl",
				"tableColumn": false,
				"subform": false
			},
			"events": {
				"onMounted": "",
				"onChange": "",
				"onRowAdd": "",
				"onRowRemove": "",
				"onPageChange": ""
			},
			"tableColumns": [
				{
					"type": "select",
					"icon": "icon-select",
					"options": {
						"defaultValue": "",
						"multiple": false,
						"disabled": false,
						"clearable": false,
						"placeholder": "",
						"required": false,
						"requiredMessage": "",
						"validatorCheck": false,
						"validator": "",
						"showLabel": false,
						"width": "",
						"options": [
							{
								"value": "1111"
							},
							{
								"value": "2222"
							},
							{
								"value": "3333"
							}
						],
						"remote": true,
						"remoteType": "datasource",
						"remoteOption": "option_7jischqs",
						"filterable": false,
						"remoteOptions": [],
						"props": {
							"value": "id",
							"label": "name"
						},
						"remoteFunc": "func_7jischqs",
						"customClass": "",
						"labelWidth": 100,
						"isLabelWidth": false,
						"hidden": false,
						"dataBind": true,
						"customProps": {},
						"tip": "",
						"extendProps": {},
						"tableColumn": true,
						"subform": false,
						"remoteDataSource": "8dl33dn7",
						"remoteArgs": {
							"fid": ""
						}
					},
					"events": {
						"onMounted": "",
						"onChange": "emw05xs6",
						"onFocus": "",
						"onBlur": ""
					},
					"name": "省",
					"novalid": {},
					"key": "7jischqs",
					"model": "province",
					"rules": []
				},
				{
					"type": "select",
					"icon": "icon-select",
					"options": {
						"defaultValue": "",
						"multiple": false,
						"disabled": false,
						"clearable": false,
						"placeholder": "",
						"required": false,
						"requiredMessage": "",
						"validatorCheck": false,
						"validator": "",
						"showLabel": false,
						"width": "",
						"options": [
							{
								"value": "1111"
							},
							{
								"value": "2222"
							},
							{
								"value": "3333"
							}
						],
						"remote": true,
						"remoteType": "datasource",
						"remoteOption": "option_7jischqs",
						"filterable": false,
						"remoteOptions": [],
						"props": {
							"value": "id",
							"label": "name"
						},
						"remoteFunc": "func_7jischqs",
						"customClass": "",
						"labelWidth": 100,
						"isLabelWidth": false,
						"hidden": false,
						"dataBind": true,
						"customProps": {},
						"tip": "",
						"extendProps": {},
						"tableColumn": true,
						"subform": false,
						"remoteDataSource": "8dl33dn7",
						"remoteArgs": {
							"fid": "{{ arguments[0].row?.province ?? ''}}"
						}
					},
					"events": {
						"onMounted": "ib6gddzf",
						"onChange": "orm0adyu",
						"onFocus": "",
						"onBlur": ""
					},
					"name": "市",
					"novalid": {},
					"key": "g1pgr8c7",
					"model": "city",
					"rules": []
				},
				{
					"type": "select",
					"icon": "icon-select",
					"options": {
						"defaultValue": "",
						"multiple": false,
						"disabled": false,
						"clearable": false,
						"placeholder": "",
						"required": false,
						"requiredMessage": "",
						"validatorCheck": false,
						"validator": "",
						"showLabel": false,
						"width": "",
						"options": [
							{
								"value": "1111"
							},
							{
								"value": "2222"
							},
							{
								"value": "3333"
							}
						],
						"remote": true,
						"remoteType": "datasource",
						"remoteOption": "option_7jischqs",
						"filterable": false,
						"remoteOptions": [],
						"props": {
							"value": "id",
							"label": "name"
						},
						"remoteFunc": "func_7jischqs",
						"customClass": "",
						"labelWidth": 100,
						"isLabelWidth": false,
						"hidden": false,
						"dataBind": true,
						"customProps": {},
						"tip": "",
						"extendProps": {},
						"tableColumn": true,
						"subform": false,
						"remoteDataSource": "8dl33dn7",
						"remoteArgs": {
							"fid": "{{ arguments[0].row?.city ?? ''}}"
						}
					},
					"events": {
						"onMounted": "spfn383m",
						"onChange": "",
						"onFocus": "",
						"onBlur": ""
					},
					"name": "区",
					"novalid": {},
					"key": "hnklmyew",
					"model": "district",
					"rules": []
				}
			],
			"name": "地区列表",
			"key": "31f7e1hl",
			"model": "areas",
			"rules": []
		}
	],
	"config": {
		"labelWidth": 100,
		"labelPosition": "right",
		"size": "default",
		"customClass": "",
		"ui": "element",
		"layout": "horizontal",
		"width": "100%",
		"hideLabel": false,
		"hideErrorMessage": false,
		"eventScript": [
			{
				"key": "refresh",
				"name": "refresh",
				"func": "",
				"type": "js"
			},
			{
				"key": "onFormChange",
				"name": "onFormChange",
				"type": "rule"
			},
			{
				"key": "mounted",
				"name": "mounted",
				"func": "// 调用对应字段的数据源请求\nthis.refreshFieldDataSource('province')\n\nthis.refreshFieldDataSource('areas.province')",
				"type": "rule",
				"rules": []
			},
			{
				"key": "99wd1n9f",
				"name": "onChange_99wd1n9f",
				"func": "const {value} = arguments[0]\n\nthis.refreshFieldDataSource('city', {fid: value})\n\nthis.setData({\n  city: '',\n  district: ''\n})",
				"type": "rule",
				"rules": [
					{
						"key": "4rr7s0hg",
						"action": "refreshFieldOptionData",
						"options": {
							"condition": " this.getValue(\"province\")",
							"isCondition": false,
							"field": "city",
							"valueTypes": {
								"fid": "fx"
							},
							"dataSource": {
								"args": {
									"fid": " this.getValue(\"province\")"
								}
							}
						}
					},
					{
						"key": "e06e26jt",
						"action": "setData",
						"options": {
							"condition": "",
							"isCondition": false,
							"fields": [
								"city",
								"district"
							],
							"values": {},
							"valueTypes": {}
						}
					}
				]
			},
			{
				"key": "x3ctac19",
				"name": "onChange_x3ctac19",
				"func": "const {value} = arguments[0]\n\nif (value) {\n  this.refreshFieldDataSource('district', {fid: value})\n  \n  this.setData({\n    district: ''\n  })\n}",
				"type": "rule",
				"rules": [
					{
						"key": "nw74re4b",
						"action": "refreshFieldOptionData",
						"options": {
							"condition": " this.getValue(\"city\")",
							"isCondition": true,
							"field": "district",
							"valueTypes": {
								"fid": "fx"
							},
							"dataSource": {
								"args": {
									"fid": " this.getValue(\"city\")"
								}
							}
						}
					},
					{
						"key": "nu3spbj5",
						"action": "setData",
						"options": {
							"condition": "",
							"isCondition": false,
							"fields": [
								"district"
							],
							"values": {},
							"valueTypes": {}
						}
					}
				]
			},
			{
				"key": "emw05xs6",
				"name": "onChange_emw05xs6",
				"func": "const {value, rowIndex, row} = arguments[0]\n\n// 此处需要对每行的数据进行单独联动\nthis.refreshFieldOptionData(`areas.${rowIndex}.city`).then(([data]) => {\n  // 用于判断是主动改变值还是删除行导致的\n  if (!data.map(item => item.id).includes(row.city)) {\n    this.setData({\n      [`areas.${rowIndex}.city`]: '',\n      [`areas.${rowIndex}.district`]: ''\n    })\n  }\n})\n\n\n/*. or \n// 我们采用获取到选项数据后，通过 setOptionData 方法单独给选项赋值\nthis.sendRequest('getCityData', {fid: value}).then(data => {\n  this.setOptionData([`areas.${rowIndex}.city`], data)\n\n  // 用于判断是主动改变值还是删除行导致的\n  let city = this.getValue(`areas.${rowIndex}.city`)\n  if (!data.map(item => item.id).includes(city)) {\n    this.setData({\n      [`areas.${rowIndex}.city`]: '',\n      [`areas.${rowIndex}.district`]: ''\n    })\n  }\n})\n*/",
				"type": "js",
				"rules": [
					{
						"key": "5nfz2tea",
						"action": "refreshFieldOptionData",
						"options": {
							"condition": "",
							"isCondition": false,
							"field": "areas.city",
							"valueTypes": {},
							"dataSource": {
								"args": {}
							}
						}
					}
				]
			},
			{
				"key": "orm0adyu",
				"name": "onChange_orm0adyu",
				"func": "const {value, rowIndex, row} = arguments[0]\n\nthis.refreshFieldOptionData(`areas.${rowIndex}.district`).then(([data]) => {\n  if (!data.map(item => item.id).includes(row.district)) {\n    this.setData({\n      [`areas.${rowIndex}.district`]: ''\n    })\n  }\n})\n\n// or\n// this.sendRequest('getCityData', {fid: value}).then(data => {\n//   this.setOptionData([`areas.${rowIndex}.district`], data)\n  \n//   let district = this.getValue(`areas.${rowIndex}.district`)\n//   if (!data.map(item => item.id).includes(district)) {\n//     this.setData({\n//       [`areas.${rowIndex}.district`]: ''\n//     })\n//   }\n// })",
				"type": "js"
			},
			{
				"key": "ib6gddzf",
				"name": "onMounted_ib6gddzf",
				"func": "const {rowIndex, row} = arguments[0]\n\nif (row.province) {\n  this.refreshFieldOptionData(`areas.${rowIndex}.city`)\n}",
				"type": "js",
				"rules": [
					{
						"key": "x2z5f3yq",
						"action": "refreshFieldOptionData",
						"options": {
							"condition": "",
							"isCondition": false,
							"field": "areas.city",
							"valueTypes": {},
							"dataSource": {
								"args": {}
							}
						}
					}
				]
			},
			{
				"key": "spfn383m",
				"name": "onMounted_spfn383m",
				"func": "const {rowIndex, row} = arguments[0]\n\nif (row.city) {\n  this.refreshFieldOptionData(`areas.${rowIndex}.district`)\n}",
				"type": "js"
			}
		],
		"dataSource": [
			{
				"key": "8dl33dn7",
				"name": "getCityData",
				"url": "https://tools-server.making.link/api/new/address",
				"method": "GET",
				"auto": true,
				"params": {
					"fid": "{{args.fid}}"
				},
				"headers": {},
				"responseFunc": "return res.data;",
				"requestFunc": "return config;",
				"args": [
					"fid"
				]
			}
		],
		"platform": "pad"
	}
}