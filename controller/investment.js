import InvestmentModel from "../model/investment.js";
import InvestorApplicationModel from "../model/investorApplication.js";
import { UserModel } from "../model/user.js";
import { createInvestmentValidator, updateInvestmentValidator,  investorApplicationValidator } from "../validators/investment.js";
import { mailtransporter } from "../utils/mail.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createInvestmentListing = async (req, res, next) => {
    try {
        const { error, value } = createInvestmentValidator.validate(req.body);
        if (error) return res.status(422).json({ error: error.details });

        const investment = await InvestmentModel.create(value);
        res.status(201).json({ message: "Investment created", investment });
    } catch (error) {
        next(error);
    }
};


export const getAllInvestorApplications = async (req, res, next) => {
    try {
        const applications = await InvestorApplicationModel.find()
            .populate("investmentId")
            .populate("investorId", "firstName lastName email")
            .populate("investorProfile");

        res.status(200).json(applications);
    } catch (error) {
        next(error);
    }
};


// Update an investment
export const updateInvestment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { error, value } = updateInvestmentValidator.validate(req.body);
        if (error) return res.status(422).json({ error: error.details });

        const updated = await InvestmentModel.findByIdAndUpdate(id, value, { new: true });
        if (!updated) return res.status(404).json({ message: "Investment not found." });

        res.status(200).json({ message: "Investment updated", investment: updated });
    } catch (error) {
        next(error);
    }
};

// Delete an investment
export const deleteInvestment = async (req, res, next) => {
    try {
        const { id } = req.params;

        const deleted = await InvestmentModel.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: "Investment not found." });

        res.status(200).json({ message: "Investment deleted." });
    } catch (error) {
        next(error);
    }
};

export const updateInvestmentApplicationStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Validate status
        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: "Status must be either 'approved' or 'rejected'." });
        }

        const application = await InvestorApplicationModel.findById(id)
            .populate("investmentId")
            .populate("investorId");

        if (!application) {
            return res.status(404).json({ message: "Application not found." });
        }

        application.status = status;
        await application.save();

        // Send email to investor
        const investor = application.investorId;
        const investment = application.investmentId;

        let subject = `Your Agrigain Investment Application was ${status}`;
        let messageHtml = `
            <p>Dear ${investor.firstName},</p>
            <p>Your application for the investment project <strong>${investment.title}</strong> has been <strong>${status}</strong>.</p>
            <p>Thank you for using Agrigain.</p>
        `;

        await mailtransporter.sendMail({
            from: process.env.EMAIL_USER,
            to: investor.email,
            subject,
            html: messageHtml,
        });

        res.status(200).json({ message: `Application ${status}`, application });
    } catch (error) {
        next(error);
    }
};




// User Actions

export const getAllInvestments = async (req, res, next) => {
    try {
        const investments = await InvestmentModel.find({ status: "open" }).sort({ createdAt: -1 });
        res.status(200).json(investments);
    } catch (error) {
        next(error);
    }
};


export const applyToInvestment = async (req, res, next) => {
    try {
        const { id: investmentId } = req.params;
        const { error, value } = investorApplicationValidator.validate(req.body);
        if (error) return res.status(422).json({ error: error.details });

        const investorId = req.auth.id;
        const investment = await InvestmentModel.findById(investmentId);
        if (!investment) return res.status(404).json({ message: "Investment not found." });

        const application = await InvestorApplicationModel.create({
            investmentId,
            investorId,
            ...value
        });

        const investor = await UserModel.findById(investorId);
        const admins = await UserModel.find({ role: "admin" });

        // Load investor email HTML
        let investorHtml = fs.readFileSync(path.join(__dirname, "../utils/investor-email.html"), "utf8");
        investorHtml = investorHtml
            .replace(/{{investorName}}/g, investor.firstName)
            .replace(/{{projectTitle}}/g, investment.title);

        await mailtransporter.sendMail({
            from: process.env.EMAIL_USER,
            to: investor.email,
            subject: "Your Agrigain Investment Application Received",
            html: investorHtml
        });

        // Load admin email HTML
        let adminHtml = fs.readFileSync(path.join(__dirname, "../utils/admin-email.html"), "utf8");
        adminHtml = adminHtml
            .replace(/{{investorName}}/g, investor.firstName)
            .replace(/{{projectTitle}}/g, investment.title);

        for (const admin of admins) {
            await mailtransporter.sendMail({
                from: process.env.EMAIL_USER,
                to: admin.email,
                subject: "📥 New Investment Application Received",
                html: adminHtml
            });
        }

        res.status(201).json({ message: "Application submitted", application });
    } catch (error) {
        next(error);
    }
};

export const getMyApplications = async (req, res, next) => {
    try {
        const investorId = req.auth.id;
        const apps = await InvestorApplicationModel.find({ investorId }).populate("investmentId");
        res.status(200).json({ count: apps.length, data: apps });
    } catch (error) {
        next(error);
    }
};


export const getMyInvestments = async (req, res, next) => {
    try {
        const investorId = req.auth.id;

        const approvedApplications = await InvestorApplicationModel.find({
            investorId,
            status: 'approved'
        }).populate("investmentId");

        const investments = approvedApplications.map(app => app.investmentId);

        res.status(200).json({
            count: investments.length,
            investments
        });
    } catch (error) {
        next(error);
    }
};

