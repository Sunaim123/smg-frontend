"use client"
import { Box, Container, List, ListItem, ListItemText, Typography } from "@mui/material"

import Layout from "../components/Layout"

const PrivacyPolicy = () => {
  return (
    <Layout>
      <Box
        id="hero"
        sx={(theme) => ({
          width: "100%",
          backgroundRepeat: "no-repeat",
          backgroundImage:
            "radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 90%), transparent)",
          ...theme.applyStyles("dark", {
            backgroundImage:
              "radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 16%), transparent)",
          }),
        })}
      >
        <Container sx={{ py: 4 }}>
          <Typography variant="h3" fontWeight="bold" textAlign="center" padding="1rem">
            Privacy Policy
          </Typography>
          <Typography paragraph>
            This Privacy Policy strives to encourage and maintain trust between you and StockMyGoods. As part of that trust, this Privacy Policy will tell you about:
          </Typography>
          <Typography variant="h5" className="fw-bold">
            What information do we collect?
          </Typography>
          <Typography paragraph>
            StockMyGoods collects information about you to help improve your shopping experience online and to provide the best products and services.
          </Typography>
          <Typography paragraph>
            Examples of information collected:
          </Typography>
          <List sx={{ listStyle: "disc", pl: 4, ".MuiListItem-root": { display: "list-item" } }}>
            <ListItem>
              <ListItemText primary="Your name." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Your phone number." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Your email address." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Your mailing address." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Your credit card number." />
            </ListItem>
          </List>
          <Typography paragraph>
            StockMyGoods may receive information about you from other sources to improve the personalization of services.
          </Typography>
          <Typography paragraph>
            We also receive and store certain types of information when you interact with our website. Like many websites, we use “cookies” to obtain information when your web browser accesses our website. The purpose of “cookies” is to help us recognize you as you use or return to our website so that we can provide a more personalized shopping experience for you. The “cookie” is also used to keep items in your shopping cart between visits. You do not need to enable cookies to browse, but must enable cookies to purchase items at bigbrandsdepot.com
          </Typography>
          <Typography paragraph>
            Our web server automatically collects clickstream information such as:
          </Typography>
          <List sx={{ listStyle: "disc", pl: 4, ".MuiListItem-root": { display: "list-item" } }}>
            <ListItem>
              <ListItemText primary="Which pages you visit on our site, which browser you used to view our site." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Any search terms you may have entered on our site, among other things." />
            </ListItem>
            <ListItem>
              <ListItemText primary="The address (or URL) of the website that you came from before visiting our site." />
            </ListItem>
          </List>
          <Typography paragraph>
            Our website may also use other technologies to track which pages our visitors view. This anonymous clickstream data provides our customers with security and helps StockMyGoods develop a more personalized shopping experience.
          </Typography>
          <Typography variant="h5" className="fw-bold">
            How is information used and protected?
          </Typography>
          <Typography paragraph>
            Our goal is to provide our customers with the highest level of service possible. From your first visit to our website to the delivery of your order, we want you to be completely satisfied with the experience without compromising your privacy. By collecting information, we are able to offer you features, such as our my StockMyGoods Account (which saves you time during the order process), and a more customized website that better reflects your individual preferences.
          </Typography>
          <Typography paragraph>
            StockMyGoods uses your information to support general business operations and provide popular products and services. These may include:
          </Typography>
          <List sx={{ listStyle: "disc", pl: 4, ".MuiListItem-root": { display: "list-item" } }}>
            <ListItem>
              <ListItemText primary="Providing A+ customer service." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Scheduling and performing deliveries or installations." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Sending marketing communications." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Fulfilling and processing your orders and communicating with you regarding those orders." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Helping to improve and customize our website and our advertising." />
            </ListItem>
            <ListItem>
              <ListItemText primary="To send you information about our products, services, and promotions." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Processing credit card information." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Protecting the security and integrity of our websites and our business." />
            </ListItem>
          </List>
          <Typography paragraph>
            StockMyGoods believes that protection of your information is of utmost concern. We utilize strict security measures to protect the confidentiality of personal information at iSave.com.
          </Typography>
          <Typography paragraph>
            StockMyGoods uses Secure Socket Layer (SSL) technology to encrypt personal information entered on iSave.com, which protects it as it is being transmitted across the internet.
          </Typography>
          <Typography variant="h5" className="fw-bold">
            How may information be shared?
          </Typography>
          <Typography paragraph>
            All information submitted to StockMyGoods is managed with care. We do not sell any customer information. StockMyGoods may share your personal information under the following limited circumstances:
          </Typography>
          <Typography variant="h4" fontWeight={700} className="fw-bold text-decoration-underline">
            Credit Card Processing and Credit Applications
          </Typography>
          <Typography paragraph>
            In order to process credit card payments, StockMyGoods uses a third-party service provider. If you consider financing a purchase through our site, your information will be securely shared with a provider.
          </Typography>
          <Typography variant="h4" fontWeight={700} className="fw-bold text-decoration-underline">
            Marketing
          </Typography>
          <Typography paragraph>
            StockMyGoods may share information with trusted partners or vendors who may promote offers considering interests that you may have.
          </Typography>
          <Typography variant="h4" fontWeight={700} className="fw-bold text-decoration-underline">
            Order Fulfillment and Service Providers
          </Typography>
          <Typography paragraph>
            We may provide your information to a third party in the process of fulfilling an order for products or services you have placed with us. For example, we may provide your address to the shipping carrier where you have requested shipment for a purchase. StockMyGoods only shares the necessary information with third parties to provide the requested products or services in your order.
          </Typography>
          <Typography variant="h4" fontWeight={700} className="fw-bold text-decoration-underline">
            Legal Requirements and Safety of our Business and Others
          </Typography>
          <Typography paragraph>
            StockMyGoods may share information in other special circumstances. We may disclose information where we have a good faith belief that disclosure is appropriate to comply with the law or where we believe disclosure is necessary to protect you, to comply with legal processes or authorities, to respond to any claims, or to protect the rights, property or personal safety of its customers, its associates, or the public. This includes exchanging information with other companies and organizations for fraud protection and credit risk reduction, and with analytics providers.
          </Typography>
          <Typography variant="h5" className="fw-bold">
            How will you be notified of future changes to the Privacy Policy?
          </Typography>
          <Typography paragraph>
            We encourage you to review this privacy policy from time to time as StockMyGoods may change or add to its Privacy Policy. We will post the date it was last updated at the bottom of the Privacy Policy for your convenience.
          </Typography>
          <Typography className="fw-bold">
            Last Updated: September 2022
          </Typography>
          <Typography variant="h5" className="fw-bold">
            What information is needed to place an order?
          </Typography>
          <List sx={{ listStyle: "disc", pl: 4, ".MuiListItem-root": { display: "list-item" } }}>
            <ListItem>
              <ListItemText primary="Billing Address (Name, Address, Phone Number, and Email)" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Shipping Address (Name, Address, Phone Number, and Email)" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Billing Information (Name on Card, Card Number, Card Type, and Expiration Date)" />
            </ListItem>
          </List>
          <Typography paragraph>
            Shipping address in order to ship your order, email address to send your receipt and tracking information, billing address to verify the identity of the cardholder, and phone number so that we can call you if there"s a problem with your order.
          </Typography>
          <Typography className="fw-bold">
            All customer information is encrypted and stored in our database and gets sent to our server via 256-bit Secure Server Certificate.
          </Typography>
          <Typography variant="h5" className="fw-bold">
            What forms of payment do you accept?
          </Typography>
          <Typography paragraph>
            For online orders via our online shopping cart, we accept credit cards, Google Checkout, and PayPal. We also accept checks and money orders. Please mail all check and money orders to the address below.
          </Typography>
        </Container>
      </Box>
    </Layout>

  )
}

export default PrivacyPolicy
