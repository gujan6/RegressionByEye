# *** Data analysis plan ***

# 0. Plan
# Three-way analysis of covariants (ANCOVA) of the effect of:
# - residual bandwidth
# - graph type
# - trend type
# -----> on error of estimation

# Covariantes:
# - participant ids
# - actual slope

# All variables are within-subjects.
# The dependent variable is the error.

library(tidyverse)
library(ggplot2)
library(gridExtra)
library(TukeyC)
library(car)
library(modelr)
library(lmtest)
library(MASS)
import::from(lmerTest, lmer)
import::from(multcomp, glht, mcp, contrMat)
import::from(broom, tidy)
import::from(psycho, analyze)

# 1. Open the data
p1 <- read.csv("/Users/elfatesati/Downloads/P1.csv")
p2 <- read.csv("/Users/elfatesati/Downloads/P2.csv")
p3 <- read.csv("/Users/elfatesati/Downloads/P3.csv")
# merge data from all participant in one df
all_results <- rbind(p1, p2, p3)
# taking the quartiles
q_results <- subset(all_results, all_results$Error..unsigned. >= quantile(all_results$Error..unsigned., 0.25 ) & all_results$Error..unsigned. <= quantile(all_results$Error..unsigned. , 0.75 ))

# > colnames(p1)
# "Sigma", "Type", "M", "Participant", "Graph.Type", "Error",
# "Error..unsigned.", "Index", "Filepath", "isValidation"

#enter robust linear regression with all the variables for a first impression
ols <- lm(Error..unsigned. ~ Sigma + Type + M + Graph.Type + Participant, data=q_results)
aov <- aov(Error..unsigned. ~ Sigma + Type + M + Graph.Type + Participant, data=q_results)
summary(ols)
# robust <- coeftest(ols, vcov=vcovHC(ols))
# robust

# 2. Visualize the data
# smean.cl.normal(...) in Hmisc (wrapped in tidyverse), which uses quantiles
# of the t-distribution to calculate confidence limits.
# 2.1. Bandwidth of Residuals (Sigma)
residuals_plot <- 
  q_results %>% 
   ggplot(aes(x = Sigma, y = Error..unsigned.)) +
       geom_point(stat = "summary", fun.y = "mean", size = 2, color = "red") +
       stat_summary(fun.data = mean_cl_normal, geom = "errorbar", width=0) + 
       ylab("Mean(error)") +
       xlab("Bandwidth of Residuals") +
       expand_limits(y = 0) + coord_flip()
residuals_plot

# 2.2. Graph type (Graph.Type)
graph_plot <- 
  q_results %>% 
    ggplot(aes(x = Graph.Type, y = Error)) +
        geom_point(stat = "summary", fun.y = "mean", size = 2, color = "red") +
        stat_summary(fun.data = mean_cl_normal, geom = "errorbar", width=0) + 
        ylab("Mean(error)") +
        xlab("Graph type") +
        expand_limits(y = 0) + coord_flip()
graph_plot

# 2.3. Trend type (Type)
trend_plot <- 
  q_results %>% 
    ggplot(aes(x = Type, y = Error..unsigned.)) +
        geom_point(stat = "summary", fun.y = "mean", size = 2, color = "red") +
        stat_summary(fun.data = mean_cl_normal, geom = "errorbar", width=0) + 
        ylab("Mean(error)") +
        xlab("Trend type") +
        expand_limits(y = 0) + coord_flip()
trend_plot

grid.arrange(residuals_plot, graph_plot, trend_plot, nrow = 1)


# 3. Analysis
# 3.1. Carry out three way ANCOVA (lmer and for "mixed effect" (appears because of the difference
# between participants) is used)
ols1 <- lmer(Error..unsigned. ~ Sigma*Graph.Type*Type + M + (1|Participant), data=q_results)
ancova <- anova(ols1)
print(ancova)  # Interaction is not significant


# *** 3.2.-3.4. include the analysis for each of the independent variables separately,
# but now I do not think that we need them. Three way ANCOVA in 3.1. should be enough.
# 3.2. Residual bandwidth
# Regression model with "Error..unsigned." as the response variable, "Sigma" as the predictor variable,
# and "Participant" and "M" (=slope) as the categorical variables.
# With interactions between categorical variables and predictor variable are taken into account:
model_residual_bandwidth <- aov(Error..unsigned.~Sigma*Participant*M, data=q_results)
print(summary(model_residual_bandwidth))
# Without interactions between categorical variables and predictor variable are taken into account:
model_residual_bandwidth2 <- aov(Error..unsigned.~Sigma+Participant+M, data=q_results)
print(summary(model_residual_bandwidth2))  # Interaction is not significant

# Compare the two models.
print(anova(model_residual_bandwidth, model_residual_bandwidth2))

# 3.3. Graph type
# Regression model with "Error" as the response variable, "Graph.Type" as the predictor variable,
# and "Participant" and "M" (=slope) as the categorical variables.
# With interactions between categorical variables and predictor variable are taken into account:
model_graph_type <- aov(Error~Graph.Type*Participant*M, data=q_results)
print(summary(model_graph_type))
# Without interactions between categorical variables and predictor variable are taken into account:
model_graph_type2 <- aov(Error~Graph.Type+Participant+M, data=q_results)
print(summary(model_graph_type2))

# Compare the two models.
print(anova(model_graph_type, model_graph_type2)) # Interaction is not significant
# plot(model_graph_type2)

# 3.4. Trend type
# Regression model with "Error..unsigned." as the response variable, "Type" as the predictor variable,
# and "Participant" and "M" (=slope) as the categorical variables.
# With interactions between categorical variables and predictor variable are taken into account:
model_trend_type <- aov(Error..unsigned.~Type*Participant*M, data=q_results)
print(summary(model_trend_type))
# Without interactions between categorical variables and predictor variable are taken into account:
model_trend_type2 <- aov(Error..unsigned.~Type+Participant+M, data=q_results)
print(summary(model_trend_type2))

# Compare the two models.
print(anova(model_trend_type, model_trend_type2))  # Interaction is not significant

# plot(Error..unsigned.~Participant, all_results)

# 4. Futher analysis
# 4.1. Tukey's Honest Significant Difference for Trends
TukeyHSD(aov, "Type", ordered = TRUE)
plot(TukeyHSD(aov, "Type")) # no difference in accuracy

# dropterm()
dropterm(ols1, test='Chisq')
