export default {
	"list": [
		{
			"type": "divider",
			"icon": "icon-fengexian",
			"options": {
				"hidden": false,
				"contentPosition": "left",
				"remoteFunc": "func_qi152uyl",
				"remoteOption": "option_qi152uyl",
				"tableColumn": false
			},
			"name": "数据统计",
			"key": "qi152uyl",
			"model": "divider_qi152uyl",
			"rules": []
		},
		{
			"type": "table",
			"icon": "icon-table",
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
				"paging": false,
				"pageSize": 5,
				"remoteFunc": "func_73xkvb1a",
				"remoteOption": "option_73xkvb1a",
				"tableColumn": false,
				"hideLabel": true
			},
			"events": {
				"onChange": "",
				"onRowAdd": "",
				"onRowRemove": "",
				"onRowChange": ""
			},
			"tableColumns": [
				{
					"type": "number",
					"icon": "icon-number",
					"options": {
						"width": "150px",
						"required": false,
						"requiredMessage": "",
						"validatorCheck": false,
						"validator": "",
						"defaultValue": 0,
						"min": 0,
						"max": 99999999,
						"step": 1,
						"disabled": false,
						"controls": true,
						"controlsPosition": "right",
						"customClass": "",
						"labelWidth": 100,
						"isLabelWidth": false,
						"hidden": false,
						"dataBind": true,
						"precision": 0,
						"remoteFunc": "func_9qt0ca72",
						"remoteOption": "option_9qt0ca72",
						"tableColumn": true
					},
					"events": {
						"onChange": "",
						"onFocus": "",
						"onBlur": ""
					},
					"name": "基本工资",
					"novalid": {},
					"key": "9qt0ca72",
					"model": "number1",
					"rules": []
				},
				{
					"type": "number",
					"icon": "icon-number",
					"options": {
						"width": "150px",
						"required": false,
						"requiredMessage": "",
						"validatorCheck": false,
						"validator": "",
						"defaultValue": 0,
						"min": 0,
						"max": 99999999,
						"step": 1,
						"disabled": false,
						"controls": true,
						"controlsPosition": "right",
						"customClass": "",
						"labelWidth": 100,
						"isLabelWidth": false,
						"hidden": false,
						"dataBind": true,
						"precision": 0,
						"remoteFunc": "func_9qt0ca72",
						"remoteOption": "option_9qt0ca72",
						"tableColumn": true
					},
					"events": {
						"onChange": "",
						"onFocus": "",
						"onBlur": ""
					},
					"name": "提成",
					"novalid": {},
					"key": "8duok1bk",
					"model": "number2",
					"rules": []
				},
				{
					"type": "number",
					"icon": "icon-number",
					"options": {
						"width": "150px",
						"required": false,
						"requiredMessage": "",
						"validatorCheck": false,
						"validator": "",
						"defaultValue": 0,
						"min": 0,
						"max": 99999999,
						"step": 1,
						"disabled": true,
						"controls": true,
						"controlsPosition": "right",
						"customClass": "",
						"labelWidth": 100,
						"isLabelWidth": false,
						"hidden": false,
						"dataBind": true,
						"precision": 0,
						"remoteFunc": "func_9qt0ca72",
						"remoteOption": "option_9qt0ca72",
						"tableColumn": true,
						"isDynamicValue": true,
						"dynamicValueType": "fx",
						"dynamicValueFx": " arguments[0].row.number1 +  arguments[0].row.number2"
					},
					"events": {
						"onChange": "",
						"onFocus": "",
						"onBlur": ""
					},
					"name": "应发合计",
					"novalid": {},
					"key": "i95ursgh",
					"model": "number3",
					"rules": []
				},
				{
					"type": "number",
					"icon": "icon-number",
					"options": {
						"width": "150px",
						"required": false,
						"requiredMessage": "",
						"validatorCheck": false,
						"validator": "",
						"defaultValue": 0,
						"min": 0,
						"max": 99999999,
						"step": 1,
						"disabled": false,
						"controls": true,
						"controlsPosition": "right",
						"customClass": "",
						"labelWidth": 100,
						"isLabelWidth": false,
						"hidden": false,
						"dataBind": true,
						"precision": 0,
						"remoteFunc": "func_9qt0ca72",
						"remoteOption": "option_9qt0ca72",
						"tableColumn": true
					},
					"events": {
						"onChange": "",
						"onFocus": "",
						"onBlur": ""
					},
					"name": "应扣金额",
					"novalid": {},
					"key": "vbuz9f1r",
					"model": "number4",
					"rules": []
				},
				{
					"type": "number",
					"icon": "icon-number",
					"options": {
						"width": "150px",
						"required": false,
						"requiredMessage": "",
						"validatorCheck": false,
						"validator": "",
						"defaultValue": 0,
						"min": -99999999,
						"max": 99999999,
						"step": 1,
						"disabled": true,
						"controls": true,
						"controlsPosition": "right",
						"customClass": "",
						"labelWidth": 100,
						"isLabelWidth": false,
						"hidden": false,
						"dataBind": true,
						"precision": 0,
						"remoteFunc": "func_9qt0ca72",
						"remoteOption": "option_9qt0ca72",
						"tableColumn": true,
						"isDynamicValue": true,
						"dynamicValueType": "fx",
						"dynamicValueFx": " arguments[0].row.number3 -  arguments[0].row.number4"
					},
					"events": {
						"onChange": "",
						"onFocus": "",
						"onBlur": ""
					},
					"name": "实发工资",
					"novalid": {},
					"key": "j5l4608m",
					"model": "number5",
					"rules": []
				}
			],
			"name": "Sub-Form",
			"key": "73xkvb1a",
			"model": "list",
			"rules": []
		},
		{
			"type": "inline",
			"icon": "icon-inlineview",
			"options": {
				"customClass": "",
				"hidden": false,
				"spaceSize": 18,
				"remoteFunc": "func_92a07pxz",
				"remoteOption": "option_92a07pxz",
				"tableColumn": false
			},
			"list": [
				{
					"type": "text",
					"icon": "icon-wenzishezhi-",
					"options": {
						"defaultValue": "合计：",
						"customClass": "",
						"labelWidth": 100,
						"isLabelWidth": false,
						"hidden": false,
						"dataBind": false,
						"required": false,
						"remoteFunc": "func_tzgzn6il",
						"remoteOption": "option_tzgzn6il",
						"hideLabel": true
					},
					"events": {
						"onChange": ""
					},
					"name": "Text",
					"key": "tzgzn6il",
					"model": "text_tzgzn6il",
					"rules": []
				},
				{
					"type": "input",
					"icon": "icon-input",
					"options": {
						"width": "130px",
						"defaultValue": "",
						"required": false,
						"requiredMessage": "",
						"dataType": "",
						"dataTypeCheck": false,
						"dataTypeMessage": "",
						"pattern": "",
						"patternCheck": false,
						"patternMessage": "",
						"validatorCheck": false,
						"validator": "",
						"placeholder": "",
						"customClass": "",
						"disabled": true,
						"labelWidth": 70,
						"isLabelWidth": true,
						"hidden": false,
						"dataBind": true,
						"showPassword": false,
						"clearable": false,
						"remoteFunc": "func_set3pbep",
						"remoteOption": "option_set3pbep",
						"hideLabel": false,
						"isDynamicValue": true,
						"dynamicValueType": "fx",
						"dynamicValueFx": " this.getValue(\"list\").map(item => item.number1).reduce((total, num) => total + num)"
					},
					"events": {
						"onChange": "",
						"onFocus": "",
						"onBlur": ""
					},
					"name": "基本工资",
					"key": "set3pbep",
					"model": "total1",
					"rules": []
				},
				{
					"type": "input",
					"icon": "icon-input",
					"options": {
						"width": "130px",
						"defaultValue": "",
						"required": false,
						"requiredMessage": "",
						"dataType": "",
						"dataTypeCheck": false,
						"dataTypeMessage": "",
						"pattern": "",
						"patternCheck": false,
						"patternMessage": "",
						"validatorCheck": false,
						"validator": "",
						"placeholder": "",
						"customClass": "",
						"disabled": true,
						"labelWidth": 70,
						"isLabelWidth": true,
						"hidden": false,
						"dataBind": true,
						"showPassword": false,
						"clearable": false,
						"remoteFunc": "func_set3pbep",
						"remoteOption": "option_set3pbep",
						"hideLabel": false,
						"isDynamicValue": true,
						"dynamicValueType": "fx",
						"dynamicValueFx": " this.getValue(\"list\").map(item => item.number2).reduce((total, num) => total + num)"
					},
					"events": {
						"onChange": "",
						"onFocus": "",
						"onBlur": ""
					},
					"name": "提成",
					"key": "yo191dkp",
					"model": "total2",
					"rules": []
				},
				{
					"type": "input",
					"icon": "icon-input",
					"options": {
						"width": "130px",
						"defaultValue": "",
						"required": false,
						"requiredMessage": "",
						"dataType": "",
						"dataTypeCheck": false,
						"dataTypeMessage": "",
						"pattern": "",
						"patternCheck": false,
						"patternMessage": "",
						"validatorCheck": false,
						"validator": "",
						"placeholder": "",
						"customClass": "",
						"disabled": true,
						"labelWidth": 70,
						"isLabelWidth": true,
						"hidden": false,
						"dataBind": true,
						"showPassword": false,
						"clearable": false,
						"remoteFunc": "func_set3pbep",
						"remoteOption": "option_set3pbep",
						"hideLabel": false,
						"isDynamicValue": true,
						"dynamicValueType": "fx",
						"dynamicValueFx": " this.getValue(\"total1\") +  this.getValue(\"total2\")"
					},
					"events": {
						"onChange": "",
						"onFocus": "",
						"onBlur": ""
					},
					"name": "应发合计",
					"key": "kgoomphd",
					"model": "total3",
					"rules": []
				},
				{
					"type": "input",
					"icon": "icon-input",
					"options": {
						"width": "130px",
						"defaultValue": "",
						"required": false,
						"requiredMessage": "",
						"dataType": "",
						"dataTypeCheck": false,
						"dataTypeMessage": "",
						"pattern": "",
						"patternCheck": false,
						"patternMessage": "",
						"validatorCheck": false,
						"validator": "",
						"placeholder": "",
						"customClass": "",
						"disabled": true,
						"labelWidth": 70,
						"isLabelWidth": true,
						"hidden": false,
						"dataBind": true,
						"showPassword": false,
						"clearable": false,
						"remoteFunc": "func_set3pbep",
						"remoteOption": "option_set3pbep",
						"hideLabel": false,
						"isDynamicValue": true,
						"dynamicValueType": "fx",
						"dynamicValueFx": " this.getValue(\"list\").map(item => item.number4).reduce((total, num) => total + num)"
					},
					"events": {
						"onChange": "",
						"onFocus": "",
						"onBlur": ""
					},
					"name": "应扣金额",
					"key": "qhr6z7zu",
					"model": "total4",
					"rules": []
				},
				{
					"type": "input",
					"icon": "icon-input",
					"options": {
						"width": "130px",
						"defaultValue": "",
						"required": false,
						"requiredMessage": "",
						"dataType": "",
						"dataTypeCheck": false,
						"dataTypeMessage": "",
						"pattern": "",
						"patternCheck": false,
						"patternMessage": "",
						"validatorCheck": false,
						"validator": "",
						"placeholder": "",
						"customClass": "",
						"disabled": true,
						"labelWidth": 70,
						"isLabelWidth": true,
						"hidden": false,
						"dataBind": true,
						"showPassword": false,
						"clearable": false,
						"remoteFunc": "func_set3pbep",
						"remoteOption": "option_set3pbep",
						"hideLabel": false,
						"isDynamicValue": true,
						"dynamicValueType": "fx",
						"dynamicValueFx": " this.getValue(\"total3\") -  this.getValue(\"total4\")"
					},
					"events": {
						"onChange": "",
						"onFocus": "",
						"onBlur": ""
					},
					"name": "实发工资",
					"key": "46e980e6",
					"model": "total5",
					"rules": []
				}
			],
			"name": "Inline",
			"key": "92a07pxz",
			"model": "inline_92a07pxz",
			"rules": []
		}
	],
	"config": {
		"labelWidth": 120,
		"labelPosition": "top",
		"size": "default",
		"customClass": "",
		"ui": "element",
		"layout": "horizontal",
		"labelCol": 3,
		"width": "900px",
		"hideLabel": false,
		"hideErrorMessage": false,
		"eventScript": [
			{
				"key": "refresh",
				"name": "refresh",
				"func": ""
			},
			{
				"key": "onFormChange",
				"name": "onFormChange",
				"type": "rule",
				"rules": [
					{
						"key": "6juv8q15",
						"action": "refreshDynamicValueAll",
						"options": {
							"condition": "",
							"isCondition": false
						}
					}
				]
			},
			{
				"key": "mounted",
				"name": "mounted",
				"func": "",
				"type": "js"
			}
		],
		"dataSource": [],
		"platform": "pc"
	}
}