import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email và mật khẩu là bắt buộc' },
        { status: 400 }
      );
    }

    // TODO: Thay thế bằng logic xác thực thực tế với database
    // Ví dụ tạm thời:
    if (email === 'admin@gearshop.com' && password === 'admin123') {
      // Tạo session/token (sẽ implement JWT sau)
      const user = {
        id: '1',
        email: email,
        name: 'Admin User',
        role: 'admin'
      };

      const response = NextResponse.json({
        success: true,
        message: 'Đăng nhập thành công',
        user: user
      });

      // Set cookie cho session (tạm thời)
      response.cookies.set('auth-token', 'temp-token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      });

      return response;
    } else {
      return NextResponse.json(
        { error: 'Email hoặc mật khẩu không chính xác' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Lỗi server nội bộ' },
      { status: 500 }
    );
  }
} 