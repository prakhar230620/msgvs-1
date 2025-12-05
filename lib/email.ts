import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
})

export async function sendWelcomeEmail(toEmail: string) {
  const mailOptions = {
    from: process.env.SMTP_EMAIL,
    to: toEmail,
    subject: "Welcome to Maa Santoshi Gramin Vikas Samiti Newsletter",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #2E7D32;">Welcome to Our Community!</h1>
        </div>
        <p>Dear Subscriber,</p>
        <p>Thank you for subscribing to the <strong>Maa Santoshi Gramin Vikas Samiti</strong> newsletter. We are thrilled to have you join our community dedicated to rural development and empowerment.</p>
        <p>You will now receive updates on:</p>
        <ul>
          <li>Our latest projects and initiatives</li>
          <li>Success stories from the field</li>
          <li>Upcoming events and volunteer opportunities</li>
        </ul>
        <p>Your support helps us make a real difference in the lives of those we serve.</p>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #757575; font-size: 12px;">
          <p>Maa Santoshi Gramin Vikas Samiti<br>
          Village Santoshi Nagar, District Satna, MP 485001<br>
          Phone: +91 9131530963 | Email: vidhyachoure17@gmail.com</p>
        </div>
      </div>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log("Welcome email sent to:", toEmail)
  } catch (error) {
    console.error("Error sending welcome email:", error)
  }
}

export async function sendAdminNotificationEmail(subscriberEmail: string) {
  const mailOptions = {
    from: process.env.SMTP_EMAIL,
    to: "vidhyachoure17@gmail.com",
    subject: "New Newsletter Subscriber Notification",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #1565C0;">New Subscriber Alert</h2>
        <p>Hello Admin,</p>
        <p>A new user has just subscribed to the newsletter.</p>
        <p><strong>Subscriber Email:</strong> ${subscriberEmail}</p>
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
        <p>Please ensure they are properly managed in the admin panel.</p>
      </div>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log("Admin notification email sent for:", subscriberEmail)
  } catch (error) {
    console.error("Error sending admin notification email:", error)
  }
}

export async function sendNewBlogPostEmail(toEmail: string, blogTitle: string, blogSlug: string, blogExcerpt: string) {
  const blogUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/blogs/${blogSlug}`

  const mailOptions = {
    from: process.env.SMTP_EMAIL,
    to: toEmail,
    subject: `New Blog Post: ${blogTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #2E7D32;">New Post from Maa Santoshi Gramin Vikas Samiti</h2>
        </div>
        <p>Hello,</p>
        <p>We have just published a new blog post that might interest you:</p>
        <h3 style="color: #1565C0;"><a href="${blogUrl}" style="text-decoration: none; color: #1565C0;">${blogTitle}</a></h3>
        <p style="font-style: italic; color: #555;">"${blogExcerpt}"</p>
        <div style="text-align: center; margin-top: 20px;">
          <a href="${blogUrl}" style="background-color: #2E7D32; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Read Full Post</a>
        </div>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #757575; font-size: 12px;">
          <p>You are receiving this email because you subscribed to our newsletter.</p>
          <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/unsubscribe" style="color: #757575;">Unsubscribe</a></p>
        </div>
      </div>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log("Blog notification email sent to:", toEmail)
  } catch (error) {
    console.error("Error sending blog notification email:", error)
  }
}

export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  const mailOptions = {
    from: process.env.SMTP_EMAIL,
    to,
    subject,
    html,
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log("Email sent to:", to)
  } catch (error) {
    console.error("Error sending email:", error)
    throw error
  }
}
