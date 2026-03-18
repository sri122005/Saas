package com.saas.multitenant.ruleengine;

import lombok.extern.slf4j.Slf4j;
import org.springframework.expression.Expression;
import org.springframework.expression.ExpressionParser;
import org.springframework.expression.spel.standard.SpelExpressionParser;
import org.springframework.expression.spel.support.StandardEvaluationContext;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@Slf4j
public class RuleEngine {

    private final ExpressionParser parser = new SpelExpressionParser();

    public boolean evaluate(String condition, Map<String, Object> data) {
        if (condition == null || condition.trim().isEmpty() || "DEFAULT".equalsIgnoreCase(condition)) {
            return true;
        }

        try {
            StandardEvaluationContext context = new StandardEvaluationContext();
            context.setVariables(data);
            
            // Supporting the requested syntax:
            // contains(field, value), startsWith(field, prefix), endsWith(field, suffix)
            // We transform these into native SpEL string operations.
            String processedCondition = condition
                .replaceAll("contains\\(([^,]+),\\s*([^\\)]+)\\)", "#$1.contains($2)")
                .replaceAll("startsWith\\(([^,]+),\\s*([^\\)]+)\\)", "#$1.startsWith($2)")
                .replaceAll("endsWith\\(([^,]+),\\s*([^\\)]+)\\)", "#$1.endsWith($2)");

            // Also ensure fields are prefixed with # if not already (simple heuristic)
            // This is a bit tricky with complex conditions, but let's assume simple fields for now
            // or use a more robust regex if needed.
            
            Expression expression = parser.parseExpression(processedCondition);
            @SuppressWarnings("null")
            Boolean result = expression.getValue(context, Boolean.class);
            return result != null && result;
        } catch (Exception e) {
            log.error("Error evaluating condition: {}", condition, e);
            return false;
        }
    }
}
