# Team H
# Authors: Mervin Cheok, Elfat Esati, Jan Gugler, Thomas Hugentobler, Lorenz Nagele, Iuliia Nigmatulina

## 0. Description
# Threeway analysis of covariance (ANCOVA) of the effect of:
# 1. residual bandwidth
# 2. graph type
# 3. trend type
# Measure: error of estimation

# Covariantes:
# participant ids
# actual slope
# All variables are within-subject design

# Dependent variable: error

# Inference plan
# 1. Load and clean the data
# 2. Visualisations
# 3. ANCOVA analysis

##########################
# load necessary packages
library(tidyverse)
library(grid)
library(gridExtra)
library(TukeyC)
library(car)
library(modelr)
library(lmtest)
library(MASS)
library(plm)
import::from(lmerTest, lmer)
import::from(multcomp, glht, mcp, contrMat)
import::from(broom, tidy)
import::from(psycho, analyze)

## 1. Loading and pre-processing the data

# 1.1 load individual data files to be merged into a single dataframe

p1 <- read.csv("data/P1.csv")
p2 <- read.csv("data/P2.csv")
p3 <- read.csv("data/P3.csv")
p4 <- read.csv("data/P4.csv")
p5 <- read.csv("data/P5.csv")
p6 <- read.csv("data/P6.csv")
p7 <- read.csv("data/P7.csv")
p8 <- read.csv("data/P8.csv")
#p9 <- read.csv("data/P9.csv") # placeholder participant ID without data
p10 <- read.csv("data/P10.csv")
p11 <- read.csv("data/P11.csv")
p12 <- read.csv("data/P12.csv")
p13 <- read.csv("data/P13.csv")
p14 <- read.csv("data/P14.csv")
#p15 <- read.csv("data/P15.csv") # placeholder participant ID without data
p16 <- read.csv("data/P16.csv")
p17 <- read.csv("data/P17.csv")
p18 <- read.csv("data/P18.csv")

# merge data from all participant in one df
all_res <- rbind(p1, p2, p3, p4, p5, p6, p7, p8, p10, p11, p12, p13, p14, p16, p17, p18)
rm(p1, p2, p3, p4, p5, p6, p7, p8, p10, p11, p12, p13, p14, p16, p17, p18)

# check the validation stimuli and delete those participants whose average error exceeds 0.2
validation_stimuli <- all_res %>% filter(isValidation == 1) %>% group_by(Participant) %>% summarise(mean = mean(Error..unsigned.))
validation_stimuli_passed <- filter(validation_stimuli, mean < 0.2)
filtered_res <- all_res %>% filter(isValidation == 0) %>% inner_join(validation_stimuli_passed, by="Participant")

# write data to a CSV file
write.csv(filtered_res, file = "data/results.csv")
rm(validation_stimuli, validation_stimuli_passed, all_res, filtered_res)

######

# 1.2 load combined results

# load the created CSV file
our_results <- read.csv("data/results.csv")

# additionally we load the original data (from the paper)
orig_results <- read.csv("data/results_orig.csv")

# interquartiles mean: discard first and forth quartile
quartiled_results <- subset(our_results, our_results$Error..unsigned. >= quantile(our_results$Error..unsigned., 0.25) & our_results$Error..unsigned. <= quantile(our_results$Error..unsigned., 0.75))

orig_quartiled_results <- subset(orig_results, orig_results$Error..unsigned. >= quantile(orig_results$Error..unsigned., 0.25) & orig_results$Error..unsigned. <= quantile(orig_results$Error..unsigned., 0.75))

# perform robust linear regression with all the variables for a first impression
ols <- lm(Error..unsigned. ~ Sigma + Type + M + Graph.Type + Participant, data=our_results)
aov <- aov(Error..unsigned. ~ Sigma + Type + M + Graph.Type + Participant, data=our_results)
summary(ols)
# robust <- coeftest(ols, vcov=vcovHC(ols))
# robust

## 2. Visualise the data

# 2.1. Bandwidth of Residuals (Sigma)
residuals_plot <- 
  our_results %>% 
  ggplot(aes(x = Sigma, y = Error..unsigned.)) +
  geom_point(stat = "summary", fun.y = "mean", size = 2, color = "red") +
  stat_summary(fun.data = mean_cl_normal, geom = "errorbar", width=0) + 
  ylab("Mean(error)") +
  xlab("Bandwidth of Residuals") +
  expand_limits(y = 0) + coord_flip()
residuals_plot

# 2.2. Graph type (Graph.Type)
graph_plot <- 
  our_results %>% 
  ggplot(aes(x = Graph.Type, y = Error..unsigned.)) +
  geom_point(stat = "summary", fun.y = "mean", size = 2, color = "red") +
  stat_summary(fun.data = mean_cl_normal, geom = "errorbar", width=0) + 
  ylab("Mean(error)") +
  xlab("Chart type") +
  expand_limits(y = 0) + coord_flip()
graph_plot

# 2.3. Trend type (Type)
trend_plot <- 
  our_results %>% 
  ggplot(aes(x = Type, y = Error..unsigned.)) +
  geom_point(stat = "summary", fun.y = "mean", size = 2, color = "red") +
  stat_summary(fun.data = mean_cl_normal, geom = "errorbar", width=0) + 
  ylab("Mean(error)") +
  xlab("Trend type") +
  expand_limits(y = 0) + coord_flip()
trend_plot

# create a function to plot three graphs (bandwidth of residuals, graph type and trend type) in a single visualisation:

# collect all graphs in one variable
plot_graphs <- function(x, title) {
  
  # 2.1. Bandwidth of Residuals (Sigma)
  residuals_plot <- 
    x %>% 
    ggplot(aes(x = Sigma, y = Error..unsigned.)) +
    geom_point(stat = "summary", fun.y = "mean", size = 2, color = "red") +
    stat_summary(fun.data = mean_cl_normal, geom = "errorbar", width=0) + 
    ylab("Mean(error)") +
    xlab("Bandwidth of Residuals") +
    expand_limits(y = 0) + coord_flip()
  # residuals_plot
  
  # 2.2. Graph type (Graph.Type)
  graph_plot <- 
    x %>% 
    ggplot(aes(x = Graph.Type, y = Error..unsigned.)) +
    geom_point(stat = "summary", fun.y = "mean", size = 2, color = "red") +
    stat_summary(fun.data = mean_cl_normal, geom = "errorbar", width=0) + 
    ylab("Mean(error)") +
    xlab("Chart type") +
    expand_limits(y = 0) + coord_flip()
  # graph_plot
  
  # 2.3. Trend type (Type)
  trend_plot <- 
    x %>% 
    ggplot(aes(x = Type, y = Error..unsigned.)) +
    geom_point(stat = "summary", fun.y = "mean", size = 2, color = "red") +
    stat_summary(fun.data = mean_cl_normal, geom = "errorbar", width=0) + 
    ylab("Mean(error)") +
    xlab("Trend type") +
    expand_limits(y = 0) + coord_flip()
  # trend_plot
  
  grid.arrange(residuals_plot, graph_plot, trend_plot, nrow = 1, top=textGrob(title, gp=gpar(fontsize=15, font=8)))
}

# visualise the original data:

plot_graphs(orig_results, "Visualisation of the original data")

# visualise our data:

plot_graphs(our_results, "Visualisation of our data")

## 3. Analysis

# 3.1. Carry out three way ANCOVA (lmer and for "mixed-effect model" (appears because of the difference between participants) is used)

# original data
ols_orig <- lmer(Error..unsigned. ~ Sigma*Graph.Type*Type + M + (1|Participant), data=orig_quartiled_results)
ancova_orig <- anova(ols_orig)
print(ancova_orig)  # Interaction is not significant

# our data
ols_our <- lmer(Error..unsigned. ~ Sigma*Graph.Type*Type + M + (1|Participant), data=quartiled_results)
ancova_our <- anova(ols_our)
print(ancova_our)  # Interaction is not significant

## 4. Further analysis

# 4.1. Average signed error

# original data
mean(orig_results$Error, na.rm = TRUE)
# one-sample t-test. H0: mean of signed error is null:
t.test(orig_results$Error, na.rm = TRUE)

# our data
mean(our_results$Error, na.rm = TRUE)
# one-sample t-test. H0: mean of signed error is null:
t.test(our_results$Error, na.rm = TRUE)
# This means that on our data the H1 is true...

# 4.2. **Tukey's Honest Significant Difference** for Trend types

TukeyHSD(aov, "Type", ordered = TRUE)
plot(TukeyHSD(aov, "Type"))  # no difference in accuracy


# 4.3. The interquartile mean of the absolute log error across all conditions in this experiment:

# original data
mean(log(orig_quartiled_results$Error..unsigned.))

# our data
mean(log(quartiled_results$Error..unsigned.))
