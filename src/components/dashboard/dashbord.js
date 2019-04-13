import React, { Component, Fragment } from 'react'
import axios from 'axios'
import { Progress, Row, Col, Table, Button, Input, Icon, Tabs, Statistic, Card, Spin, Steps } from 'antd'
import Flag from 'react-world-flags'
import { withGlobalState } from 'react-globally'
import moment from 'moment/moment'
import _ from 'lodash'
import ReactGA from 'react-ga';



class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {},
      hasData: false,
      searchText: '',
      link: '',
      hasGovtResponded: false
    }
  }


  componentDidMount() {
    this.getData()
    setInterval(() => this.getData(), 10000)
    ReactGA.initialize('UA-137485697-1');
    // ReactGA.pageview(this.props.location.pathname)
  }

  sortDesc = (a, b) => {
    return a - b;
  }

  getData = () => {
    const url = this.props.globalState.url || this.props.url
    axios
      .get(url)
      .then(res => {
        this.setState({
          data: res.data.data.attributes,
          hasData: true,
          link: res.data.link
        })
        this.props.setGlobalState({ data: res.data.data.attributes })
      })
      .catch(err => console.error(err))
  }



  handleSearch = (selectedKeys, confirm) => {
    confirm();
    this.setState({ searchText: selectedKeys[0] });
  }

  handleReset = (clearFilters) => {
    clearFilters()
    this.setState({ searchText: '' });
  }

  percent = (a, b) => (100 * a) / b;


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
            style={{ width: 188, marginBottom: 8, display: 'block' }} />
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm)}
            icon="search"
            size="small"
            style={{ width: 90, marginRight: 8 }}>
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
    const { action, background, signature_count, signatures_by_country, government_response, state,
      signatures_by_constituency, created_at, opened_at, scheduled_debate_date } = this.state.data
    const { TabPane } = Tabs;
    const { Step } = Steps
    const antIcon = <Icon type="loading" style={{ fontSize: 124 }} spin />;
    const maxByCountry = _.maxBy(signatures_by_country, 'signature_count')
    const maxByConstituency = _.maxBy(signatures_by_constituency, 'signature_count')
    const minByCountry = _.minBy(signatures_by_country, 'signature_count')
    const minByConstituency = _.minBy(signatures_by_constituency, 'signature_count')

    let ukVotes = 0
    signature_count ? ukVotes = _.find(signatures_by_country, { code: 'GB' }).signature_count : 'loading'
    const percentage = this.percent(ukVotes, signature_count)

    const columns = [{
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      ...this.getCountrySearch('name')
    }, {
      title: 'Total',
      dataIndex: 'signature_count',
      key: 'signature_count',
      sorter: (a, b) => b.signature_count - a.signature_count,
    }, {
      title: 'Flag',
      dataIndex: 'code',
      key: 'code',
      render: code => (
        <Flag code={code} height='26' width='30' />
      )
    }]

    const bColumns = [{
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      ...this.getCountrySearch('name')

    }, {
      title: 'Total',
      dataIndex: 'signature_count',
      key: 'signature_count',
      sorter: (a, b) => b.signature_count - a.signature_count,
    }]

    return (
      <Fragment>
        {this.state.hasData ? (
          <Fragment>
            {/* <p>{this.props.globalState.url}</p> */}
            <h1 style={{ marginTop: 40 }}>Petition</h1>
            <h2>{action}</h2>
            <p>{background}</p>
            <div className="stats">
              <Row>
                <Col span={8}>
                  <Statistic title="Signatures" value={parseInt(signature_count, 0).toLocaleString()} />
                </Col>
                <Col span={8}>
                  <Statistic title="Created" value={moment(created_at).format('LL')} />

                </Col>
                <Col span={8}>
                  <Statistic title="Deadline" value={moment(opened_at).add(6, 'M').format('LL')} />
                </Col>
              </Row>

            </div>
            {government_response ? (
              <div className="steps" style={{ margin: '20px 0' }}>
                <Steps size="small" current={3}>
                  <Step title="State" description={_.upperFirst(state)} />
                  <Step title="Govt Responded On" description={moment(government_response.responded_on).format("LL")} />
                  <Step title="Schedule Debate " description={moment(scheduled_debate_date).format('LL')} />
                </Steps>
              </div>
            ) : ('<p>No government response yet</p>')}



            <Tabs defaultActiveKey="1" style={{ margin: 30 }}>
              <TabPane tab="Table View" key="1">
                <Row >
                  <Col span={12}>
                    <h3 className='text-c'>By Country</h3>
                    <Table columns={columns} rowKey="name" bordered dataSource={signatures_by_country} />
                  </Col>
                  <Col span={12}>
                    <h3 className='text-c'>By Constituency</h3>
                    <Table columns={bColumns} rowKey="name" bordered dataSource={signatures_by_constituency} />
                  </Col>
                </Row>
              </TabPane>

              <TabPane tab="Map View" key="2">
                <Col span={12}>
                  <h3 className='text-c'>By Country</h3>
                  <div className="map">

                  </div>
                </Col>
                <Col span={12}>
                  <h3 className='text-c'>By Constituency</h3>
                </Col>
              </TabPane>

              <TabPane tab="Statistics" key="3">
                <div style={{ padding: '30px' }}>
                  <Row>
                    <Col span={6}>
                      <Card title="Countries Voting" bordered={false}>
                        <h1>{_.size(signatures_by_country)}</h1>
                      </Card>
                    </Col>
                    <Col span={6}>
                      <Card title="Constituencies Voting" bordered={false}>
                        <h1>{_.size(signatures_by_constituency)}</h1>
                      </Card>
                    </Col>
                    <Col span={6}>
                      <Card title="Total UK Votes" bordered={false}>
                        <h1>{(ukVotes.toLocaleString())}</h1>
                        <Progress percent={Number(percentage.toFixed(1))} size="small" />
                      </Card>
                    </Col>
                    <Col span={6}>
                      <Card title="Rest of the World" bordered={false}>
                        <h1>{(signature_count - ukVotes).toLocaleString()}</h1>
                        <Progress percent={(100 - percentage).toFixed(1)} size="small" />
                      </Card>
                    </Col>

                  </Row>


                  <Row>
                    <Col span={6}>
                      <Card title="Max Vote By Country" bordered={false}>
                        <h1>{maxByCountry.signature_count.toLocaleString()}</h1>
                        <p>{maxByCountry.name}   <Flag code={maxByCountry.code} height='26' width='30' /></p>
                      </Card>
                    </Col>
                    <Col span={6}>
                      <Card title="Max Vote By Constituency" bordered={false}>
                        <h1>{maxByConstituency.signature_count.toLocaleString()}</h1>
                        <p>{maxByConstituency.name}</p>

                      </Card>
                    </Col>
                    <Col span={6}>
                      <Card title="Min Vote by Country" bordered={false}>
                        <h1>{minByCountry.signature_count.toLocaleString()}</h1>
                        <p>{minByCountry.name} <Flag code={minByCountry.code} height='26' width='30' /></p>

                      </Card>
                    </Col>
                    <Col span={6}>
                      <Card title="Min Vote By Constituency" bordered={false}>
                        <h1>{minByConstituency.signature_count.toLocaleString()}</h1>
                        <p>{minByConstituency.name}</p>
                      </Card>
                    </Col>
                  </Row>

                  <Row>
                    <Col span={12}>
                      <Card title="Mean Vote by Country" bordered={false}>
                        <h1> {_.meanBy(signatures_by_country, 'signature_count').toFixed(2).toLocaleString()}</h1>
                        <p>Votes</p>

                      </Card>
                    </Col>
                    <Col span={12}>
                      <Card title="Mean Vote by Constituency" bordered={false}>
                        <h1> {_.meanBy(signatures_by_constituency, 'signature_count').toFixed(2)}</h1>
                        <p>Votes</p>
                      </Card>
                    </Col>

                  </Row>
                </div>
              </TabPane>

              {/* <TabPane tab="Chart" key="4">
                <div style={{ padding: '30px' }}>
                  <h1>Votes by Continent</h1>

                </div>
              </TabPane> */}
            </Tabs>

          </Fragment>
        ) : (
            <div className='loader'>
              <Spin indicator={antIcon} style={{ margin: 'auto' }} />
              <p style={{ marginTop: 100 }}>Loading...</p>
            </div>
          )}

      </Fragment>
    )
  }
}

Dashboard.defaultProps = {
  url: 'https://petition.parliament.uk/petitions/241584.json'
}

export default withGlobalState(Dashboard)
