import React from "react";
import {
  Form,
  Input,
  Col,
  Row,
  Button,
  Select,
  Divider,
  Typography,
} from "antd";


const { Option } = Select;

const validateMessages = {
  required: "${label} is required!",
  types: {
    email: "${label} is not a valid email!",
    number: "${label} is not a valid number!",
  },
  number: {
    range: "${label} must be between ${min} and ${max}",
  },
};

const Signuppage = () => {
  const onFinish = (values) => {
    console.log(values);
  };
  return (
    <div style={style.bgImageCard} className="h-screen w-screen select-none ">
      <div style={style.overlay} className="flex items-center justify-center">
        <div className="px-8 pt-8 bg-white/[1.0] rounded-md drop-shadow drop-shadow-[0_0_15px_rgba(0,0,0,0.10)] w-[52rem]  min-h-[36rem]">
          <div className="text-gray-700 font-bold text-3xl mb-8">Sign Up</div>
          <Form
            layout="vertical"
            name="nest-messages"
            onFinish={onFinish}
            validateMessages={validateMessages}
            requiredMark="optional"
            // hideRequiredMark
          >
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="username"
                  label="Username"
                  rules={[{ required: true }]}
                >
                  {/* <Input /> */}
                  <div className="w-full h-8 border border-gray-300 rounded-sm flex items-center">
                    <Typography className="ml-2 font-semibold text-blue-500">
                      timost1234
                    </Typography>
                    <Typography className="ml-2 font-regular text-gray-300">
                      (This could not be changed)
                    </Typography>
                  </div>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="fullname"
                  label="Full Name"
                  rules={[{ required: true }]}
                  tooltip="Enter you full name in chinese (if applicable)"
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[{ type: "email", required: true }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="sid"
                  label="Student ID"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item name="lab" label="Lab" rules={[{ required: true }]}>
                  <Select placeholder="Select your lab" allowClear>
                    <Option value="lab203">Lab 203</Option>
                    <Option value="lab403">Lab 403</Option>
                    <Option value="lab405">Lab 405</Option>
                    <Option value="other">Other</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Divider className="mt-2 mb-4"></Divider>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="password"
                  label="Password"
                  rules={[
                    {
                      required: true,
                      message: "Please input your password!",
                    },
                  ]}
                  hasFeedback
                >
                  <Input.Password />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="confirm"
                  label="Confirm Password"
                  dependencies={["password"]}
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: "Please confirm your password!",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }

                        return Promise.reject(
                          new Error(
                            "The two passwords that you entered do not match!"
                          )
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="code"
                  label="Authorization code"
                  tooltip="You could get this from your administrator"
                  hasFeedback
                  //   validateStatus="error"
                  rules={[
                    {
                      required: true,
                      message: "Please input your password!",
                    },
                  ]}
                >
                  <Input.Group compact>
                    <Input style={{ width: "calc(100% - 5rem)" }} />
                    <Button className="w-[5rem]">Verify</Button>
                  </Input.Group>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item wrapperCol={{ offset: 0, span: 16 }}>
              <Button
                disabled={true}
                type="primary"
                htmlType="submit"
                className="bg-blue-500"
              >
                Submit
              </Button>
              <Button htmlType="button" onClick={() => {}} className="ml-4">
                Reset
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

const style = {
  bgImageCard: {
    backgroundImage: `url("https://i.imgur.com/gbkz46Y.jpg")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "cover",
  },
  overlay: {
    position: "absolute",
    height: "100%",
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
};

export default Signuppage;
