
import click
import traceback

from flask.cli import with_appcontext
from sqlalchemy import or_
from sqlalchemy.exc import SQLAlchemyError, IntegrityError

from backend.extensions import db
from backend.models.user import User


@click.command("create-admin")
@with_appcontext
def create_admin():
    """Tao tai khoan quan tri WebGIS Quang Tri."""

    click.echo("=" * 55)
    click.echo("WEBGIS QUANG TRI - CREATE ADMIN")
    click.echo("=" * 55)

    username = click.prompt("Admin username", type=str).strip()
    email = click.prompt("Admin email", type=str).strip().lower()

    password = click.prompt(
        "Admin password",
        hide_input=True,
        type=str,
    )

    confirm_password = click.prompt(
        "Confirm password",
        hide_input=True,
        type=str,
    )

    # Kiem tra du lieu dau vao
    if not username or not email:
        raise click.ClickException(
            "Username va email khong duoc de trong."
        )

    if len(username) < 3:
        raise click.ClickException(
            "Username phai co it nhat 3 ky tu."
        )

    if "@" not in email:
        raise click.ClickException(
            "Email khong hop le."
        )

    if len(password) < 12:
        raise click.ClickException(
            "Mat khau phai co it nhat 12 ky tu."
        )

    if password != confirm_password:
        raise click.ClickException(
            "Mat khau xac nhan khong khop."
        )

    try:
        # Kiem tra username hoac email da ton tai
        existing_user = (
            db.session.query(User)
            .filter(
                or_(
                    User.username == username,
                    User.email == email,
                )
            )
            .first()
        )

        if existing_user:
            raise click.ClickException(
                "Username hoac email da ton tai."
            )

        # Tao tai khoan ADMIN
        admin = User(
            username=username,
            email=email,
            role="ADMIN",
            is_active=True,
            token_version=0,
        )

        # Ma hoa mat khau qua model User
        admin.set_password(password)

        db.session.add(admin)
        db.session.commit()

        click.echo("")
        click.secho(
            "Tao tai khoan ADMIN thanh cong!",
            fg="green",
            bold=True,
        )
        click.echo(f"Admin ID: {admin.id}")
        click.echo(f"Username: {admin.username}")
        click.echo(f"Email: {admin.email}")
        click.echo(f"Role: {admin.role}")
        click.echo(f"Active: {admin.is_active}")

    except click.ClickException:
        db.session.rollback()
        raise

    except IntegrityError:
        db.session.rollback()

        click.echo("")
        click.secho(
            "LOI RANG BUOC DU LIEU POSTGRESQL:",
            fg="red",
        )
        traceback.print_exc()

        raise click.ClickException(
            "Khong the tao Admin do vi pham rang buoc du lieu."
        )

    except SQLAlchemyError:
        db.session.rollback()

        click.echo("")
        click.secho(
            "LOI SQLALCHEMY / POSTGRESQL:",
            fg="red",
        )
        traceback.print_exc()

        raise click.ClickException(
            "Khong the tao Admin. Xem traceback phia tren."
        )

    except Exception:
        db.session.rollback()

        click.echo("")
        click.secho(
            "LOI KHONG XAC DINH:",
            fg="red",
        )
        traceback.print_exc()

        raise click.ClickException(
            "Khong the tao Admin. Xem traceback phia tren."
        )


def register_admin_commands(app):
    """Dang ky lenh CLI vao Flask."""
    app.cli.add_command(create_admin)