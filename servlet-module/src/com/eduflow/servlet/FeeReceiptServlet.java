package com.eduflow.servlet;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.sql.SQLException;

@WebServlet("/receipt")
public class FeeReceiptServlet extends HttpServlet {

    private final ReportRepository repository = new ReportRepository();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        Long studentId = parseId(request.getParameter("studentId"));
        if (studentId == null) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "studentId is required");
            return;
        }

        try {
            var receipt = repository.findFeeReceipt(studentId);
            if (receipt.isEmpty()) {
                response.sendError(HttpServletResponse.SC_NOT_FOUND, "Fee record not found");
                return;
            }
            request.setAttribute("receipt", receipt.get());
            request.getRequestDispatcher("/WEB-INF/jsp/fee-receipt.jsp").forward(request, response);
        } catch (SQLException | IllegalStateException exception) {
            throw new ServletException("Unable to load fee receipt", exception);
        }
    }

    private Long parseId(String value) {
        try {
            return value == null ? null : Long.valueOf(value);
        } catch (NumberFormatException exception) {
            return null;
        }
    }
}
