import React, { Component, Fragment } from 'react'
import axios from 'axios'
import { Typography, Row, Col, Table, Button, Input, Icon, Tabs, Statistic, Card, Spin } from 'antd'
import Flag from 'react-world-flags'
import { withGlobalState } from 'react-globally'
import moment from 'moment/moment'
import ss from 'simple-statistics'
class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {},
      hasData: false,
      searchText: '',
      link: ''
    }
  }


  componentDidMount() {
    this.getData()
    // setInterval(() => this.forceUpdate(), 5000)
  }

  sortDesc = (a, b) => {
    return a - b;
  }

  getData = () => {
    const url = 'https://petition.parliament.uk/petitions/241584.json'
    axios
      .get(url)
      .then(res => {
        this.setState({ data: res.data.data.attributes, hasData: true, link: res.data.link.self })

      })
      .catch(err => console.error(err))
  }


  handleSearch = (selectedKeys, confirm) => {
    confirm();
    this.setState({ searchText: selectedKeys[0] });
  }

  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: '' });
  }


  getCountrySearch = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys, selectedKeys, confirm, clearFilters,
    }) => (
        <div style={{ padding: 8 }}>
          <Input
            ref={node => { this.searchInput = node; }}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm)}
            icon="search"
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            Search
        </Button>
          <Button
            onClick={() => this.handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
        </Button>
        </div>
      ),
    filterIcon: filtered => <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
  })


  render() {
    const { action, background, signature_count, signatures_by_country,
      signatures_by_constituency, created_at } = this.state.data
    const { Title } = Typography;
    const TabPane = Tabs.TabPane;
    const antIcon = <Icon type="loading" style={{ fontSize: 124 }} spin />;

    const columns = [{
      title: 'Name',
      dataIndex: 'name',
      ...this.getCountrySearch('name')
    }, {
      title: 'Total',
      dataIndex: 'signature_count',
      sorter: (a, b) => b.signature_count - a.signature_count,
    }, {
      title: 'Flag',
      dataIndex: 'code',
      render: code => (
        <Flag code={code} height='26' width='20' />
      )
    }]

    const bColumns = [{
      title: 'Name',
      dataIndex: 'name',
      ...this.getCountrySearch('name')

    }, {
      title: 'Total',
      dataIndex: 'signature_count',
      sorter: (a, b) => b.signature_count - a.signature_count,
    }]

    return (
      <Fragment>
        {this.state.hasData ? (
          <Fragment>
            <p>{this.props.globalState.url}</p>
            <h1 style={{ marginTop: 40 }}>Petition</h1>
            <h2>{action}</h2>
            <p>{background}</p>

            {/* <div style={{ display: 'flex' }}>
          <h1>{parseInt(signature_count, 0).toLocaleString()} </h1>
          <span>
            <h3 style={{ alignSelf: 'bottom' }}> {' '}signatures</h3>
          </span>
        </div> */}
            <div className="stats" style={{ margin: 'auto' }}>
              <Row>
                <Col span={8}>
                  <Statistic title="Signatures" value={parseInt(signature_count, 0).toLocaleString()} />
                </Col>
                <Col span={8}>
                  <Statistic title="Created" value={moment(created_at).format('L')} />

                </Col>
                <Col span={8}>
                  <Statistic title="Deadline" value={moment(created_at).add(6, 'M').calendar()} />

                </Col>
              </Row>
            </div>


            <Tabs defaultActiveKey="1" onChange={this.callback} style={{ margin: 30 }}>
              <TabPane tab="Table View" key="1">
                <Row>
                  <Col span={12}>
                    <Title level={3}>By Country</Title>
                    <Table columns={columns} bordered dataSource={signatures_by_country} />
                  </Col>
                  <Col span={12}>
                    <Title level={3}>By Constituency</Title>
                    <Table columns={bColumns} bordered dataSource={signatures_by_constituency} />
                  </Col>
                </Row>
              </TabPane>

              <TabPane tab="Map View" key="2">
                <Row>
                  <Col span={12}>
                    <Title level={3}>By Country</Title>
                  </Col>
                  <Col span={12}>
                    <Title level={3}>By Constituency</Title>
                    {/* <Table columns={bColumns} bordered dataSource={signatures_by_constituency} /> */}
                  </Col>
                </Row>
              </TabPane>

              <TabPane tab="Statistics" key="3">
                <div style={{ padding: '30px' }}>
                  <Row>
                    <Col span={6}>
                      <Card title="Highest Vote By Country" bordered={false}>
                        <h2>{console.log([signatures_by_country])}</h2>
                      </Card>
                    </Col>
                    <Col span={6}>
                      <Card title="Highest Vote By Constituency" bordered={false}></Card>
                    </Col>
                    <Col span={6}>
                      <Card title="Median Vote by Country" bordered={false}></Card>
                    </Col>
                    <Col span={6}>
                      <Card title="Median Vote by Constituency" bordered={false}></Card>
                    </Col>
                  </Row>
                </div>
              </TabPane>

              <TabPane tab="Chart" key="4">
                <div style={{ padding: '30px' }}>

                </div>
              </TabPane>
            </Tabs>

          </Fragment>
        ) : (
            <div className='loader'><Spin indicator={antIcon} style={{ margin: 'auto' }} /></div>
          )}

      </Fragment>
    )
  }
}

Dashboard.defaultProps = {
  url: 'https://petition.parliament.uk/petitions/241584.json'
}

export default withGlobalState(Dashboard)
