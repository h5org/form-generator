export const basicComponents = [
  {
    type: 'input',
    icon: 'icon-input',
    options: {
      width: '',
      defaultValue: '',
      required: false,
      requiredMessage: '',
      dataType: '',
      dataTypeCheck: false,
      dataTypeMessage: '',
      pattern: '',
      patternCheck: false,
      patternMessage: '',
      validatorCheck: false,
      validator: '',
      placeholder: '',
      customClass: '',
      disabled: false,
      labelWidth: 100,
      isLabelWidth: false,
      hidden: false,
      dataBind: true,
      showPassword: false,
      clearable: false,
      maxlength: '',
      showWordLimit: false,
      customProps: {},
      tip: '',
      extendProps: {}
    },
    events: {
      onMounted: '',
      onChange: '',
      onFocus: '',
      onBlur: '',
    }
  },
  {
    type: 'textarea',
    icon: 'icon-diy-com-textarea',
    options: {
      width: '',
      defaultValue: '',
      required: false,
      requiredMessage: '',
      disabled: false,
      pattern: '',
      patternMessage: '',
      validatorCheck: false,
      validator: '',
      placeholder: '',
      customClass: '',
      labelWidth: 100,
      isLabelWidth: false,
      hidden: false,
      dataBind: true,
      clearable: false,
      maxlength: '',
      showWordLimit: false,
      rows: 2,
      autosize: false,
      customProps: {},
      tip: '',
      extendProps: {}
    },
    events: {
      onMounted: '',
      onChange: '',
      onFocus: '',
      onBlur: ''
    }
  },
  {
    type: 'number',
    icon: 'icon-number',
    options: {
      width: '',
      required: false,
      requiredMessage: '',
      validatorCheck: false,
      validator: '',
      defaultValue: 0,
      min: 0,
      max: 9,
      step: 1,
      disabled: false,
      controls: true,
      controlsPosition: '',
      customClass: '',
      labelWidth: 100,
      isLabelWidth: false,
      hidden: false,
      dataBind: true,
      precision: 0,
      customProps: {},
      tip: '',
      extendProps: {}
    },
    events: {
      onMounted: '',
      onChange: '',
      onFocus: '',
      onBlur: ''
    }
  },
  {
    type: 'radio',
    icon: 'icon-radio-active',
    options: {
      inline: false,
      defaultValue: '',
      showLabel: false,
      options: [
        {
          value: 'Option 1',
          label: 'Option 1'
        },
        {
          value: 'Option 2',
          label: 'Option 2'
        },
        {
          value: 'Option 3',
          label: 'Option 3'
        }
      ],
      required: false,
      requiredMessage: '',
      validatorCheck: false,
      validator: '',
      width: '',
      remote: false,
      remoteType: 'datasource',
      remoteOption: '',
      remoteOptions: [],
      props: {
        value: 'value',
        label: 'label'
      },
      remoteFunc: '',
      customClass: '',
      labelWidth: 100,
      isLabelWidth: false,
      hidden: false,
      dataBind: true,
      disabled: false,
      customProps: {},
      tip: '',
      extendProps: {}
    },
    events: {
      onMounted: '',
      onChange: ''
    }
  },
  {
    type: 'checkbox',
    icon: 'icon-check-box',
    options: {
      inline: false,
      defaultValue: [],
      showLabel: false,
      options: [
        {
          value: 'Option 1'
        },
        {
          value: 'Option 2'
        },
        {
          value: 'Option 3'
        }
      ],
      required: false,
      requiredMessage: '',
      validatorCheck: false,
      validator: '',
      width: '',
      remote: false,
      remoteType: 'datasource',
      remoteOption: '',
      remoteOptions: [],
      props: {
        value: 'value',
        label: 'label'
      },
      remoteFunc: '',
      customClass: '',
      labelWidth: 100,
      isLabelWidth: false,
      hidden: false,
      dataBind: true,
      disabled: false,
      customProps: {},
      tip: '',
      extendProps: {}
    },
    events: {
      onMounted: '',
      onChange: ''
    }
  },
  {
    type: 'select',
    icon: 'icon-select',
    options: {
      defaultValue: '',
      multiple: false,
      disabled: false,
      clearable: false,
      placeholder: '',
      required: false,
      requiredMessage: '',
      validatorCheck: false,
      validator: '',
      showLabel: false,
      width: '',
      options: [
        {
          value: 'Option 1'
        },
        {
          value: 'Option 2'
        },{
          value: 'Option 3'
        }
      ],
      remote: false,
      remoteType: 'datasource',
      remoteOption: '',
      filterable: false,
      remoteOptions: [],
      props: {
        value: 'value',
        label: 'label'
      },
      remoteFunc: '',
      customClass: '',
      labelWidth: 100,
      isLabelWidth: false,
      hidden: false,
      dataBind: true,
      customProps: {},
      tip: '',
      extendProps: {}
    },
    events: {
      onMounted: '',
      onChange: '',
      onFocus: '',
      onBlur: ''
    }
  },
  {
    type: 'time',
    icon: 'icon-time',
    options: {
      defaultValue: '',
      readonly: false,
      disabled: false,
      editable: false,
      clearable: true,
      placeholder: '',
      startPlaceholder: '',
      endPlaceholder: '',
      isRange: false,
      arrowControl: false,
      format: 'HH:mm:ss',
      required: false,
      requiredMessage: '',
      validatorCheck: false,
      validator: '',
      width: '',
      customClass: '',
      labelWidth: 100,
      isLabelWidth: false,
      hidden: false,
      dataBind: true,
      customProps: {},
      tip: '',
      extendProps: {}
    },
    events: {
      onMounted: '',
      onChange: '',
      onFocus: '',
      onBlur: ''
    }
  },
  {
    type: 'date',
    icon: 'icon-date',
    options: {
      defaultValue: '',
      readonly: false,
      disabled: false,
      editable: false,
      clearable: true,
      placeholder: '',
      startPlaceholder: '',
      endPlaceholder: '',
      type: 'date',
      format: 'YYYY-MM-DD',
      timestamp: false,
      required: false,
      requiredMessage: '',
      validatorCheck: false,
      validator: '',
      width: '',
      customClass: '',
      labelWidth: 100,
      isLabelWidth: false,
      hidden: false,
      dataBind: true,
      customProps: {},
      tip: '',
      extendProps: {}
    },
    events: {
      onMounted: '',
      onChange: '',
      onFocus: '',
      onBlur: ''
    }
  },
  {
    type: 'rate',
    icon: 'icon-pingfen1',
    options: {
      defaultValue: null,
      max: 5,
      disabled: false,
      allowHalf: false,
      required: false,
      requiredMessage: '',
      validatorCheck: false,
      validator: '',
      customClass: '',
      labelWidth: 100,
      isLabelWidth: false,
      hidden: false,
      dataBind: true,
      showScore: false,
      width: '',
      customProps: {},
      tip: '',
      extendProps: {}
    },
    events: {
      onMounted: '',
      onChange: ''
    }
  },
  {
    type: 'color',
    icon: 'icon-color',
    options: {
      defaultValue: '',
      disabled: false,
      showAlpha: false,
      required: false,
      requiredMessage: '',
      validatorCheck: false,
      validator: '',
      customClass: '',
      labelWidth: 100,
      isLabelWidth: false,
      hidden: false,
      dataBind: true,
      width: '',
      customProps: {},
      tip: '',
      extendProps: {}
    },
    events: {
      onMounted: '',
      onChange: ''
    }
  },
  {
    type: 'switch',
    icon: 'icon-switch',
    options: {
      defaultValue: false,
      required: false,
      requiredMessage: '',
      validatorCheck: false,
      validator: '',
      disabled: false,
      customClass: '',
      labelWidth: 100,
      isLabelWidth: false,
      hidden: false,
      dataBind: true,
      width: '',
      customProps: {},
      tip: '',
      extendProps: {}
    },
    events: {
      onMounted: '',
      onChange: ''
    }
  },
  {
    type: 'slider',
    icon: 'icon-slider',
    options: {
      defaultValue: 0,
      disabled: false,
      required: false,
      requiredMessage: '',
      validatorCheck: false,
      validator: '',
      min: 0,
      max: 100,
      step: 1,
      showInput: false,
      range: false,
      width: '',
      customClass: '',
      labelWidth: 100,
      isLabelWidth: false,
      hidden: false,
      dataBind: true,
      customProps: {},
      tip: '',
      extendProps: {}
    },
    events: {
      onMounted: '',
      onChange: ''
    }
  },
  {
    type: 'text',
    icon: 'icon-wenzishezhi-',
    options: {
      defaultValue: 'This is a text',
      customClass: '',
      labelWidth: 100,
      isLabelWidth: false,
      hidden: false,
      dataBind: true,
      required: false,
      validatorCheck: false,
      validator: '',
      width: '',
      tip: ''
    },
    events: {
      onMounted: '',
      onChange: ''
    }
  },
  {
    type: 'html',
    icon: 'icon-html',
    options: {
      defaultValue: '<b style="color: red;">\n\tThis is a HTML5\n</b>',
      labelWidth: 100,
      isLabelWidth: false,
      hidden: false,
      dataBind: true,
      required: false,
      validatorCheck: false,
      validator: '',
      width: '',
      tip: ''
    },
    events: {
      onMounted: '',
      onChange: ''
    }
  },
  {
    type: 'button',
    icon: 'icon-button',
    options: {
      customClass: '',
      disabled: false,
      labelWidth: 100,
      isLabelWidth: false,
      hideLabel: true,
      hidden: false,
      buttonSize: 'default',
      buttonType: '',
      buttonPlain: false,
      buttonRound: false,
      buttonCircle: false,
      buttonName: 'Button',
      width: '',
      customProps: {},
      tip: '',
      extendProps: {}
    },
    events: {
      onMounted: '',
      onClick: ''
    }
  },
  {
    type: 'link',
    icon: 'icon-lianjie',
    options: {
      customClass: '',
      disabled: false,
      labelWidth: 100,
      isLabelWidth: false,
      hideLabel: false,
      hidden: false,
      linkType: 'default',
      linkName: 'Link',
      underline: true,
      blank: true,
      href: '',
      customProps: {},
      tip: '',
      extendProps: {}
    },
    events: {
      onMounted: '',
      onClick: ''
    }
  },
  {
    type: 'cascader',
    icon: 'icon-jilianxuanze',
    options: {
      defaultValue: [],
      width: '',
      placeholder: '',
      disabled: false,
      clearable: false,
      options: [
        {
          value: 'Option 1',
          label: 'Option 1',
          children: [
            {value: 'Option 1 - children', label: 'Option 1 - children'}
          ]
        },
        {
          value: 'Option 2',
          label: 'Option 2',
          children: [
            {value: 'Option 2 - children', label: 'Option 2 - children'}
          ]
        },{
          value: 'Option 3',
          label: 'Option 3'
        }
      ],
      remote: false,
      remoteType: 'datasource',
      remoteOption: '',
      remoteOptions: [],
      props: {
        value: 'value',
        label: 'label',
        children: 'children'
      },
      remoteFunc: '',
      customClass: '',
      labelWidth: 100,
      isLabelWidth: false,
      hidden: false,
      dataBind: true,
      required: false,
      validatorCheck: false,
      validator: '',
      multiple: false,
      filterable: false,
      checkStrictly: false,
      customProps: {},
      tip: '',
      extendProps: {}
    },
    events: {
      onMounted: '',
      onChange: '',
      onFocus: '',
      onBlur: ''
    }
  },
  {
    type: 'treeselect',
    icon: 'icon-shuxuanzeqi',
    options: {
      defaultValue: [],
      width: '',
      placeholder: '',
      disabled: false,
      clearable: false,
      options: [
        {
          value: 'Option 1',
          label: 'Option 1',
          children: [
            {value: 'Option 1 - children', label: 'Option 1 - children'}
          ]
        },
        {
          value: 'Option 2',
          label: 'Option 2',
          children: [
            {value: 'Option 2 - children', label: 'Option 2 - children'}
          ]
        },{
          value: 'Option 3',
          label: 'Option 3'
        }
      ],
      remote: false,
      remoteType: 'datasource',
      remoteOption: '',
      remoteOptions: [],
      props: {
        value: 'value',
        label: 'label',
        children: 'children'
      },
      remoteFunc: '',
      customClass: '',
      labelWidth: 100,
      isLabelWidth: false,
      hidden: false,
      dataBind: true,
      required: false,
      validatorCheck: false,
      validator: '',
      multiple: false,
      filterable: false,
      checkStrictly: false,
      customProps: {},
      tip: '',
      extendProps: {}
    },
    events: {
      onMounted: '',
      onChange: '',
      onFocus: '',
      onBlur: ''
    }
  },
  {
    type: 'steps',
    icon: 'icon-m-buzhou',
    options: {
      defaultValue: 0,
      customClass: '',
      labelWidth: 100,
      isLabelWidth: false,
      hideLabel: true,
      hidden: false,
      dataBind: true,
      steps: [
        {
          title: 'Step 1'
        },
        {
          title: 'Step 2'
        },
        {
          title: 'Step 3'
        }
      ],
      props: {
        title: 'title',
        description: 'description'
      },
      remote: false,
      width: '',
      direction: 'horizontal',
      processStatus: 'process',
      finishStatus: 'finish',
      alignCenter: false,
      simple: false,
      remoteType: 'datasource',
      customProps: {},
      tip: '',
      extendProps: {}
    },
    events: {
      onMounted: '',
      onChange: ''
    }
  },
  {
    type: 'transfer',
    icon: 'icon-m-chuansuokuang',
    options: {
      defaultValue: [],
      customClass: '',
      labelWidth: 100,
      isLabelWidth: false,
      hideLabel: false,
      hidden: false,
      dataBind: true,
      data: [
        {key: '1', label: 'Option 1'},
        {key: '2', label: 'Option 2'},
        {key: '3', label: 'Option 3'},
      ],
      props: {
        key: 'key',
        label: 'label',
        disabled: 'disabled'
      },
      filterable: false,
      required: false,
      validatorCheck: false,
      validator: '',
      width: '',
      remote: false,
      titles: ['Source', 'Target'],
      disabled: false,
      remoteType: 'datasource',
      customProps: {},
      tip: '',
      extendProps: {}
    },
    events: {
      onMounted: '',
      onChange: ''
    }
  },
  {
    type: 'pagination',
    icon: 'icon-pagination',
    options: {
      defaultValue: 1,
      customClass: '',
      disabled: false,
      labelWidth: 100,
      isLabelWidth: false,
      hideLabel: true,
      hidden: false,
      dataBind: true,
      background: true,
      pageSize: 10,
      pagerCount: 5,
      total: 100,
      customProps: {},
      extendProps: {}
    },
    events: {
      onMounted: '',
      onChange: ''
    }
  }
]

export const advanceComponents = [
  {
    type: 'blank',
    icon: 'icon-zidingyishuju',
    options: {
      defaultType: 'String',
      customClass: '',
      width: '',
      labelWidth: 100,
      isLabelWidth: false,
      hidden: false,
      dataBind: true,
      required: false,
      pattern: '',
      validator: '',
      tip: ''
    },
    events: {
      onMounted: '',
      onChange: ''
    }
  },
  {
    type: 'component',
    icon: 'icon-component',
    options: {
      customClass: '',
      labelWidth: 100,
      isLabelWidth: false,
      hidden: false,
      dataBind: true,
      template: '<div>自定义内容</div>',
      required: false,
      pattern: '',
      validator: '',
      width: '',
      tip: ''
    },
    events: {
      onMounted: '',
      onChange: ''
    }
  },
  {
    type: 'fileupload',
    icon: 'icon-wenjianshangchuan',
    options: {
      defaultValue: [],
      width: '',
      tokenFunc: 'funcGetToken',
      token: '',
      tokenType: 'datasource',
      domain: '',
      disabled: false,
      tip: '',
      action: '',
      customClass: '',
      limit: 9,
      multiple: false,
      isQiniu: false,
      labelWidth: 100,
      isLabelWidth: false,
      hidden: false,
      dataBind: true,
      headers: [],
      required: false,
      validatorCheck: false,
      validator: '',
      withCredentials: false
    },
    events: {
      onMounted: '',
      onChange: '',
      onSelect: '',
      onUploadSuccess: '',
      onUploadError: '',
      onRemove: ''
    }
  },
  {
    type: 'imgupload',
    icon: 'icon-tupian',
    options: {
      defaultValue: [],
      size: {
        width: 100,
        height: 100,
      },
      width: '',
      tokenFunc: 'funcGetToken',
      token: '',
      tokenType: 'datasource',
      domain: '',
      disabled: false,
      readonly: false,
      limit: 8,
      multiple: false,
      isQiniu: false,
      isDelete: true,
      min: 0,
      isEdit: true,
      action: '',
      customClass: '',
      labelWidth: 100,
      isLabelWidth: false,
      hidden: false,
      dataBind: true,
      headers: [],
      required: false,
      validatorCheck: false,
      validator: '',
      withCredentials: false,
      tip: ''
    },
    events: {
      onMounted: '',
      onChange: '',
      onSelect: '',
      onUploadSuccess: '',
      onUploadError: '',
      onRemove: ''
    }
  },
  {
    type: 'editor',
    icon: 'icon-fuwenbenkuang',
    options: {
      defaultValue: '',
      width: '',
      customClass: '',
      labelWidth: 100,
      isLabelWidth: false,
      hidden: false,
      dataBind: true,
      customToolbar: [
        [ 'bold', 'italic', 'underline', 'strike', 
          { 'color': [] }, 
          { 'background': [] }, 
          { 'align': [] },
          { 'list': 'ordered'}, 
          { 'list': 'bullet' },
          { 'indent': '-1'}, 
          { 'indent': '+1' }
        ], 
        [{ 'font': [] },{ 'header': [1, 2, 3, 4, 5, 6, false] }],               
        [{ 'script': 'sub'}, { 'script': 'super' }],  
        ['link', 'image','blockquote', 'code-block'],
        [{ 'direction': 'rtl' }], 
        ['clean'] 
      ],
      disabled: false,
      required: false,
      validatorCheck: false,
      validator: '',
      tip: ''
    },
    events: {
      onMounted: '',
      onChange: ''
    }
  },
  {
    type: 'list',
    icon: 'icon-shujubiaoge',
    options: {
      defaultValue: [
        {
          date: '2016-05-03',
          name: 'Tom',
          state: 'California',
          city: 'Los Angeles',
          address: 'No. 189, Grove St, Los Angeles',
          zip: 'CA 90036',
          tag: 'Home',
        },
        {
          date: '2016-05-02',
          name: 'Tom',
          state: 'California',
          city: 'Los Angeles',
          address: 'No. 189, Grove St, Los Angeles',
          zip: 'CA 90036',
          tag: 'Office',
        },
        {
          date: '2016-05-04',
          name: 'Tom',
          state: 'California',
          city: 'Los Angeles',
          address: 'No. 189, Grove St, Los Angeles',
          zip: 'CA 90036',
          tag: 'Home',
        },
        {
          date: '2016-05-01',
          name: 'Tom',
          state: 'California',
          city: 'Los Angeles',
          address: 'No. 189, Grove St, Los Angeles',
          zip: 'CA 90036',
          tag: 'Office',
        },
      ],
      width: '',
      maxHeight: '',
      stripe: false,
      border: false,
      customClass: '',
      labelWidth: 100,
      isLabelWidth: false,
      hideLabel: true,
      hidden: false,
      dataBind: true,
      columns: [
        {
          "label": "Date",
          "prop": "date",
          "width": "",
          "sortable": false,
          "fixed": false,
          "align": "left",
          "headderAlign": "left",
          "fixedOption": "left",
          "defaultSlot": false,
          "defaultSlotTemplate": "",
          "headerSlot": false,
          "headerSlotTemplate": "",
          "key": "69vku4oh"
        },
        {
          "label": "Name",
          "prop": "name",
          "width": "",
          "sortable": false,
          "fixed": false,
          "align": "left",
          "headderAlign": "left",
          "fixedOption": "left",
          "defaultSlot": false,
          "defaultSlotTemplate": "",
          "headerSlot": false,
          "headerSlotTemplate": "",
          "key": "8zm66bqm"
        },
        {
          "label": "Address",
          "prop": "address",
          "width": "",
          "sortable": false,
          "fixed": false,
          "align": "left",
          "headderAlign": "left",
          "fixedOption": "left",
          "defaultSlot": false,
          "defaultSlotTemplate": "",
          "headerSlot": false,
          "headerSlotTemplate": "",
          "key": "ariv7pud"
        }
      ],
      highlight: false,
      selection: false,
      showOperation: false,
      operations: {
        width: 200,
        buttons: [
          // {
          //   name: 'Edit',
          //   type: 'primary', // primary, default, text, link
          //   event: ''
          // }
        ]
      },
      pagination: {
        paging: false,
        pageSize: 10,
        currentPage: 1,
        pagerCount: 7,
        pageSizes: '10, 20, 50, 100',
        background: false,
        small: false,
        props: {
          list: 'records',
          total: 'total',
          size: 'pageSize',
          current: 'currentPage'
        }
      },
      tip: ''
    },
    events: {
      onMounted: '',
      onChange: '',
      onPageChange: '',
      onCurrentRow: '',
      onSelectionChange: ''
    }
  }
  
]

export const layoutComponents = [
  {
    type: 'grid',
    icon: 'icon-RectangleCopy',
    columns: [
      {
        type: 'col',
        options: {
          span: 12,
          offset: 0,
          push: 0,
          pull: 0,
          xs: 24,
          sm: 12,
          md: 12,
          lg: 12,
          xl: 12,
          customClass: ''
        },
        list: []
      },
    ],
    options: {
      gutter: 0,
      justify: 'start',
      align: 'top',
      customClass: '',
      hidden: false,
      flex: true,
      responsive: true
    }
  },
  {
    type: 'report',
    icon: 'icon-table1',
    options: {
      customClass: '',
      hidden: false,
      borderWidth: 1,
      borderColor: '#999',
      width: '100%'
    },
    headerRow: [
      {
        type: 'th',
        options: {
          width: ''
        }
      }
    ],
    rows: [
      {
        columns: [
          {
            type: 'td',
            options: {
              customClass: '',
              colspan: 1,
              rowspan: 1,
              align: 'left',
              valign: 'top',
              width: '',
              height: ''
            },
            list: []
          }
        ]
      }
    ]
  },
  {
    type: 'tabs',
    icon: 'icon-tabs',
    tabs: [
      {
        label: 'Tab 1',
        name: 'tab_1',
        list: []
      }
    ],
    options: {
      type: '',
      tabPosition: 'top',
      customClass: '',
      hidden: false,
    }
  },
  {
    type: 'collapse',
    icon: 'icon-zhediemianban',
    tabs: [
      {
        title: 'Collapse 1',
        name: 'collapse_1',
        list: []
      }
    ],
    options: {
      type: '',
      accordion: false,
      customClass: '',
      hidden: false,
    }
  },
  {
    type: 'inline',
    icon: 'icon-inlineview',
    options: {
      customClass: '',
      hidden: false,
      spaceSize: 10
    },
    list: []
  },
  {
    type: 'card',
    icon: 'icon-kapian',
    list: [],
    options: {
      title: 'Card name',
      showHeader: true,
      bordered: true,
      customClass: '',
      shadow: 'always',
      width: '',
      padding: '10px',
      hidden: false
    }
  },
  {
    type: 'divider',
    icon: 'icon-fengexian',
    options: {
      hidden: false,
      contentPosition: 'left',
      customProps: {}
    }
  },
  {
    type: 'alert',
    icon: 'icon-jinggaotishi',
    options: {
      hidden: false,
      title: 'Info alert',
      type: 'info',
      description: '',
      closable: true,
      center: false,
      showIcon: false,
      effect: 'light',
      width: '',
      customProps: {}
    }
  }
]

export const collectionComponents = [
  {
    type: 'table',
    icon: 'icon-kebianjibiaoge',
    options: {
      defaultValue: [],
      customClass: '',
      labelWidth: 100,
      isLabelWidth: false,
      hidden: false,
      dataBind: true,
      disabled: false,
      required: false,
      validatorCheck: false,
      validator: '',
      paging: false,
      pageSize: 5,
      isAdd: true,
      isDelete: true,
      showControl: true,
      virtualTable: true,
      tip: ''
    },
    events: {
      onMounted: '',
      onChange: '',
      onRowAdd: '',
      onRowRemove: '',
      onPageChange: ''
    },
    tableColumns: []
  },
  {
    type: 'subform',
    icon: 'icon-a-ziyuan25',
    options: {
      defaultValue: [],
      customClass: '',
      labelWidth: 100,
      isLabelWidth: false,
      hidden: false,
      dataBind: true,
      disabled: false,
      required: false,
      validatorCheck: false,
      validator: '',
      paging: false,
      pageSize: 5,
      showControl: true,
      isAdd: true,
      isDelete: true,
      tip: ''
    },
    events: {
      onMounted: '',
      onChange: '',
      onRowAdd: '',
      onRowRemove: '',
      onPageChange: ''
    },
    list: []
  },
  {
    type: 'dialog',
    icon: 'icon-Dialog',
    options: {
      defaultValue: {},
      visible: false,
      customClass: '',
      title: 'Dialog Title',
      width: '',
      top: '15vh',
      center: false,
      cancelText: 'Cancel',
      showClose: true,
      okText: 'Confirm',
      showCancel: true,
      showOk: true,
      confirmLoading: false,
      dataBind: true,
    },
    list: [],
    events: {
      onOpen: '',
      onClose: '',
      onCancel: '',
      onConfirm: ''
    }
  },
  {
    type: 'group',
    icon: 'icon-fenzu',
    options: {
      defaultValue: {},
      customClass: '',
      labelWidth: 100,
      isLabelWidth: false,
      hidden: false,
      dataBind: true,
      width: '',
      validatorCheck: false,
      validator: '',
      tip: ''
    },
    list: [],
    events: {
      onMounted: '',
    }
  }
]
