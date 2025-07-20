# Markdown和LaTeX渲染测试

这是一个测试文档，包含了各种Markdown语法和LaTeX数学公式。

## 基本文本格式

这是**粗体文本**，这是*斜体文本*，这是~~删除线文本~~。

这是一个`内联代码`示例。

## 数学公式测试

### 内联数学公式

这是一个内联数学公式：$E = mc^2$，爱因斯坦质能方程。

二次方程的解：$x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$

### 块级数学公式

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

矩阵表示：

$$
\begin{pmatrix}
a & b \\
c & d
\end{pmatrix}
\begin{pmatrix}
x \\
y
\end{pmatrix}
=
\begin{pmatrix}
ax + by \\
cx + dy
\end{pmatrix}
$$

傅里叶变换：

$$
F(\omega) = \int_{-\infty}^{\infty} f(t) e^{-i\omega t} dt
$$

### 复杂公式

贝叶斯定理：

$$
P(A|B) = \frac{P(B|A) \cdot P(A)}{P(B)}
$$

麦克斯韦方程组：

$$
\begin{align}
\nabla \cdot \mathbf{E} &= \frac{\rho}{\epsilon_0} \\
\nabla \cdot \mathbf{B} &= 0 \\
\nabla \times \mathbf{E} &= -\frac{\partial \mathbf{B}}{\partial t} \\
\nabla \times \mathbf{B} &= \mu_0 \mathbf{J} + \mu_0 \epsilon_0 \frac{\partial \mathbf{E}}{\partial t}
\end{align}
$$

## 代码块

```python
def fibonacci(n):
    """计算斐波那契数列"""
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# 计算前10个斐波那契数
for i in range(10):
    print(f"F({i}) = {fibonacci(i)}")
```

```javascript
class MathUtils {
  static factorial(n) {
    if (n <= 1) return 1;
    return n * this.factorial(n - 1);
  }
  
  static combination(n, r) {
    return this.factorial(n) / (this.factorial(r) * this.factorial(n - r));
  }
}
```

## 表格

| 函数 | 导数 | 积分 |
|------|------|------|
| $x^n$ | $nx^{n-1}$ | $\frac{x^{n+1}}{n+1}$ |
| $e^x$ | $e^x$ | $e^x$ |
| $\sin x$ | $\cos x$ | $-\cos x$ |
| $\cos x$ | $-\sin x$ | $\sin x$ |
| $\ln x$ | $\frac{1}{x}$ | $x\ln x - x$ |

## 列表

### 无序列表

- 线性代数
  - 向量空间
  - 矩阵运算
  - 特征值和特征向量
- 微积分
  - 极限
  - 导数
  - 积分
- 概率论
  - 随机变量
  - 概率分布
  - 统计推断

### 有序列表

1. 理解问题
2. 设计算法
3. 编写代码
4. 测试验证
5. 优化性能

### 任务列表

- [x] 实现Markdown渲染
- [x] 添加LaTeX支持
- [ ] 性能优化
- [ ] 错误处理
- [ ] 单元测试

## 引用

> 数学是科学的语言。
> 
> —— 伽利略·伽利莱

> 在数学中，我们发现了真理的主要器官。
> 
> —— 哥特弗里德·莱布尼茨

## 链接

查看更多信息：[KaTeX文档](https://katex.org/docs/)

## 分隔线

---

## 高级数学示例

### 微分方程

$$
\frac{d^2y}{dx^2} + p(x)\frac{dy}{dx} + q(x)y = f(x)
$$

### 积分变换

拉普拉斯变换：

$$
\mathcal{L}\{f(t)\} = F(s) = \int_0^{\infty} f(t)e^{-st}dt
$$

### 统计学公式

正态分布：

$$
f(x) = \frac{1}{\sigma\sqrt{2\pi}} e^{-\frac{1}{2}\left(\frac{x-\mu}{\sigma}\right)^2}
$$

### 复分析

欧拉公式：

$$
e^{i\theta} = \cos\theta + i\sin\theta
$$

## 性能测试内容

这是一个长文本段落，用于测试渲染性能。Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

$$
\sum_{n=1}^{\infty} \frac{1}{n^2} = \frac{\pi^2}{6}
$$

这个公式展示了巴塞尔问题的解，是数学史上的经典结果之一。

```json
{
  "performance": {
    "rendering_time": "< 100ms",
    "memory_usage": "optimal",
    "scroll_smoothness": "60fps"
  },
  "features": {
    "markdown": true,
    "latex": true,
    "syntax_highlighting": true,
    "tables": true,
    "task_lists": true
  }
}
```

通过这个综合测试，我们可以验证：

1. **Markdown基本语法**：标题、段落、强调、链接等
2. **LaTeX数学公式**：内联公式、块级公式、复杂方程
3. **代码高亮**：多种编程语言的语法高亮
4. **表格渲染**：包含数学公式的表格
5. **性能表现**：长文本和复杂公式的渲染性能

---

*测试完成时间：*$(new Date()).toISOString()$